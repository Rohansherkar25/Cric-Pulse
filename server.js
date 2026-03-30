// ===========================
// CricPulse — server.js v3
// Node.js + Express + MongoDB
// + Cricbuzz RapidAPI (LIVE)
// ===========================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();

// Allow all origins (required for Render deployment)
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'] }));
app.use(express.json());

// Serve frontend — works both locally and on Render
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// ── Cricbuzz API Config ─────────────────────────────────────────────────────
const CRICBUZZ_BASE = 'https://cricbuzz-cricket.p.rapidapi.com';
const CRICBUZZ_HEADERS = {
  'x-rapidapi-key': process.env.RAPIDAPI_KEY,
  'x-rapidapi-host': process.env.RAPIDAPI_HOST || 'cricbuzz-cricket.p.rapidapi.com',
  'Content-Type': 'application/json',
};

// Helper — call Cricbuzz
async function cricbuzz(path, params = {}) {
  const res = await axios.get(`${CRICBUZZ_BASE}${path}`, {
    headers: CRICBUZZ_HEADERS,
    params,
  });
  return res.data;
}

// ── MongoDB ─────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cricpulse';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ── Schemas ─────────────────────────────────────────────────────────────────

const MatchSchema = new mongoose.Schema({
  type: { type: String, required: true },
  format: { type: String, enum: ['t20', 'odi', 'test'], required: true },
  status: { type: String, enum: ['live', 'upcoming', 'completed'], default: 'upcoming' },
  venue: String,
  date: { type: Date, default: Date.now },
  team1: { name: String, flag: String, score: { type: String, default: 'TBD' }, overs: { type: String, default: '' } },
  team2: { name: String, flag: String, score: { type: String, default: 'TBD' }, overs: { type: String, default: '' } },
  crr: String, result: String, winner: String,
  batting: [{
    team: String,
    players: [{
      name: String, runs: Number, balls: Number, fours: Number, sixes: Number,
      sr: Number, status: String, how: String
    }]
  }],
  bowling: [{
    team: String,
    players: [{ name: String, overs: String, maiden: Number, runs: Number, wkts: Number, econ: Number }]
  }],
  ballByBall: [{ over: Number, balls: [String] }],
  fow: [{ score: String, name: String, over: String }],
}, { timestamps: true });

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: String, color: String, role: String,
  dob: String, debut: String, tests: Number, odis: Number, t20s: Number,
  batting: { runs: Number, avg: Number, sr: Number, hs: Number, hundreds: Number, fifties: Number },
  bowling: { wkts: Number, avg: Number, econ: Number, sr: Number, five: Number },
  recentScores: [Number],
  formats: {
    test: { runs: Number, avg: Number, wkts: Number },
    odi: { runs: Number, avg: Number, wkts: Number },
    t20: { runs: Number, avg: Number, wkts: Number },
  },
}, { timestamps: true });

const StandingSchema = new mongoose.Schema({
  tournament: { type: String, required: true },
  team: String, flag: String, pos: Number,
  p: Number, w: Number, l: Number, nr: Number, nrr: String, pts: Number,
});

const ICCRankingSchema = new mongoose.Schema({
  format: { type: String, enum: ['test', 'odi', 't20'], required: true },
  role: { type: String, enum: ['batting', 'bowling', 'allrounder', 'team'], required: true },
  rank: Number, name: String, country: String, flag: String, rating: Number, change: String,
  updatedAt: { type: Date, default: Date.now },
});

const BracketSchema = new mongoose.Schema({
  tournament: { type: String, required: true },
  rounds: [{
    name: String,
    matches: [{
      t1: String, f1: String, s1: String,
      t2: String, f2: String, s2: String,
      winner: String, status: { type: String, enum: ['live', 'upcoming', 'completed'], default: 'upcoming' }
    }]
  }]
}, { timestamps: true });

const Match = mongoose.model('Match', MatchSchema);
const Player = mongoose.model('Player', PlayerSchema);
const Standing = mongoose.model('Standing', StandingSchema);
const ICCRanking = mongoose.model('ICCRanking', ICCRankingSchema);
const Bracket = mongoose.model('Bracket', BracketSchema);

// ═══════════════════════════════════════════════════════════════════════════
// REAL CRICBUZZ API PROXY ROUTES
// These call the live Cricbuzz RapidAPI and return real cricket data
// ═══════════════════════════════════════════════════════════════════════════

// GET /api/cricbuzz/live — Real live matches from Cricbuzz
app.get('/api/cricbuzz/live', async (req, res) => {
  try {
    const data = await cricbuzz('/matches/v1/live');
    // Flatten all match types into a single array
    const matches = [];
    (data.typeMatches || []).forEach(type => {
      (type.seriesMatches || []).forEach(series => {
        const wrapper = series.seriesAdWrapper || series;
        (wrapper.matches || []).forEach(m => {
          if (m.matchInfo) {
            // Helper: get the latest innings score for a team
            // Cricbuzz uses inngs1 for 1st innings, inngs2 for 2nd innings
            const getScore = (teamScore) => {
              if (!teamScore) return { score: 'TBD', overs: '' };
              const inn = teamScore.inngs2 || teamScore.inngs1;
              if (!inn) return { score: 'TBD', overs: '' };
              const wkts = inn.wickets != null ? inn.wickets : inn.wkts ?? '';
              return {
                score: `${inn.runs ?? 0}${wkts !== '' ? '/' + wkts : ''}`,
                overs: inn.overs != null ? String(inn.overs) : '',
              };
            };

            const t1s = getScore(m.matchScore?.team1Score);
            const t2s = getScore(m.matchScore?.team2Score);

            // CRR: use the batting team's current innings
            const battingInn = m.matchScore?.team2Score?.inngs1
              || m.matchScore?.team1Score?.inngs2
              || m.matchScore?.team1Score?.inngs1;
            const crrVal = battingInn && battingInn.overs > 0
              ? `CRR: ${(battingInn.runs / battingInn.overs).toFixed(2)}`
              : (m.matchInfo.status || '');

            matches.push({
              matchId: m.matchInfo.matchId,
              seriesName: wrapper.seriesName || type.matchType,
              format: (m.matchInfo.matchFormat || 'T20').toLowerCase(),
              status: m.matchInfo.status,
              venue: m.matchInfo.venueInfo
                ? `${m.matchInfo.venueInfo.ground}, ${m.matchInfo.venueInfo.city}`
                : 'TBD',
              team1: {
                name: m.matchInfo.team1?.teamSName || m.matchInfo.team1?.teamName,
                score: t1s.score,
                overs: t1s.overs,
              },
              team2: {
                name: m.matchInfo.team2?.teamSName || m.matchInfo.team2?.teamName,
                score: t2s.score,
                overs: t2s.overs,
              },
              crr: crrVal,
            });
          }
        });
      });
    });
    res.json({ success: true, count: matches.length, matches });
  } catch (err) {
    console.error('Cricbuzz live error:', err.message);
    res.status(502).json({ success: false, error: 'Cricbuzz API error', detail: err.message });
  }
});

// GET /api/cricbuzz/upcoming — Upcoming matches
app.get('/api/cricbuzz/upcoming', async (req, res) => {
  try {
    const data = await cricbuzz('/matches/v1/upcoming');
    const matches = [];
    (data.typeMatches || []).forEach(type => {
      (type.seriesMatches || []).forEach(series => {
        const wrapper = series.seriesAdWrapper || series;
        (wrapper.matches || []).forEach(m => {
          if (m.matchInfo) {
            matches.push({
              matchId: m.matchInfo.matchId,
              seriesName: wrapper.seriesName || type.matchType,
              format: (m.matchInfo.matchFormat || 'T20').toLowerCase(),
              status: m.matchInfo.status,
              startTime: m.matchInfo.startDate
                ? new Date(parseInt(m.matchInfo.startDate)).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
                : 'TBD',
              venue: m.matchInfo.venueInfo
                ? `${m.matchInfo.venueInfo.ground}, ${m.matchInfo.venueInfo.city}`
                : 'TBD',
              team1: { name: m.matchInfo.team1?.teamSName || m.matchInfo.team1?.teamName },
              team2: { name: m.matchInfo.team2?.teamSName || m.matchInfo.team2?.teamName },
            });
          }
        });
      });
    });
    res.json({ success: true, count: matches.length, matches });
  } catch (err) {
    console.error('Cricbuzz upcoming error:', err.message);
    res.status(502).json({ success: false, error: 'Cricbuzz API error', detail: err.message });
  }
});

// GET /api/cricbuzz/recent — Recent completed matches
app.get('/api/cricbuzz/recent', async (req, res) => {
  try {
    const data = await cricbuzz('/matches/v1/recent');
    const matches = [];
    (data.typeMatches || []).forEach(type => {
      (type.seriesMatches || []).forEach(series => {
        const wrapper = series.seriesAdWrapper || series;
        (wrapper.matches || []).forEach(m => {
          if (m.matchInfo) {
            matches.push({
              matchId: m.matchInfo.matchId,
              seriesName: wrapper.seriesName || type.matchType,
              format: (m.matchInfo.matchFormat || 'T20').toLowerCase(),
              result: m.matchInfo.status,
              venue: m.matchInfo.venueInfo
                ? `${m.matchInfo.venueInfo.ground}, ${m.matchInfo.venueInfo.city}`
                : 'TBD',
              team1: {
                name: m.matchInfo.team1?.teamSName || m.matchInfo.team1?.teamName,
                score: m.matchScore?.team1Score?.inngs1
                  ? `${m.matchScore.team1Score.inngs1.runs}/${m.matchScore.team1Score.inngs1.wickets}`
                  : 'N/A',
              },
              team2: {
                name: m.matchInfo.team2?.teamSName || m.matchInfo.team2?.teamName,
                score: m.matchScore?.team2Score?.inngs1
                  ? `${m.matchScore.team2Score.inngs1.runs}/${m.matchScore.team2Score.inngs1.wickets}`
                  : 'N/A',
              },
            });
          }
        });
      });
    });
    res.json({ success: true, count: matches.length, matches });
  } catch (err) {
    console.error('Cricbuzz recent error:', err.message);
    res.status(502).json({ success: false, error: 'Cricbuzz API error', detail: err.message });
  }
});

// GET /api/cricbuzz/debug/:matchId — Dump full raw hscard response
app.get('/api/cricbuzz/debug/:matchId', async (req, res) => {
  try {
    const data = await cricbuzz(`/mcenter/v1/${req.params.matchId}/hscard`);
    // Return the full raw response so we can see every key and nested structure
    res.json({ success: true, raw: data });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// GET /api/cricbuzz/scorecard/:matchId — Live scorecard using hscard endpoint
app.get('/api/cricbuzz/scorecard/:matchId', async (req, res) => {
  try {
    const data = await cricbuzz(`/mcenter/v1/${req.params.matchId}/hscard`);

    // ── hscard structure ──────────────────────────────────────────────────
    // data.scorecard[] — array of innings, each with:
    //   .batsman[]       — array of batsmen  (field: outdec, strkrate, name)
    //   .bowler[]        — array of bowlers  (field: economy, maidens, wickets)
    //   .fow.fow[]       — fall of wickets   (field: batsmanname, overnbr, runs)
    //   .extras          — { legbyes, byes, wides, noballs, total }
    //   .batteamname     — full team name
    //   .batteamsname    — short team name
    //   .score / .wickets / .overs / .runrate
    // ─────────────────────────────────────────────────────────────────────

    const rawInnings = data.scorecard || [];

    // Build a lookup: inningsid → batteamname so we can derive bowl team name
    // In a 2-innings match: inn 1 bowler = inn 2 batter, and vice versa
    const batTeamByInn = {};
    rawInnings.forEach(inn => { batTeamByInn[inn.inningsid] = { name: inn.batteamname, sname: inn.batteamsname }; });

    // Normalise each innings into a consistent frontend-friendly shape
    const scoreCard = rawInnings.map(inn => ({
      // Keep original fields
      ...inn,
      // Add normalised sub-structures the frontend render functions will use
      batTeamDetails: {
        batTeamName: inn.batteamname || '',
        batTeamShortName: inn.batteamsname || '',
        batsmenData: (inn.batsman || []).map(b => ({
          batName: b.name,
          runs: b.runs,
          balls: b.balls,
          fours: b.fours,
          sixes: b.sixes,
          strikeRate: b.strkrate,
          outDesc: b.outdec === 'not out' ? '' : (b.outdec || ''),
          isBatting: b.outdec === 'not out' || b.outdec === '',
          iscaptain: b.iscaptain,
          iskeeper: b.iskeeper,
        })),
      },
      bowlTeamDetails: {
        // Derive bowl team = the team batting in the OTHER innings
        bowlTeamName: inn.bowlteamname || (inn.inningsid === 1 ? (batTeamByInn[2]?.name || '') : (batTeamByInn[1]?.name || '')),
        bowlTeamShortName: inn.bowlteamsname || (inn.inningsid === 1 ? (batTeamByInn[2]?.sname || '') : (batTeamByInn[1]?.sname || '')),
        bowlersData: (inn.bowler || []).map(b => ({
          bowlName: b.name,
          overs: b.overs,
          maidens: b.maidens,
          runs: b.runs,
          wickets: b.wickets,
          economy: b.economy,
          wides: b.wides || 0,
          noBalls: b.noballs || 0,
        })),
      },
      scoreDetails: {
        runs: inn.score,
        wickets: inn.wickets,
        overs: inn.overs,
      },
      extrasData: inn.extras ? {
        byes: inn.extras.byes || 0,
        legByes: inn.extras.legbyes || 0,
        wides: inn.extras.wides || 0,
        noBalls: inn.extras.noballs || 0,
        extras: inn.extras.total || 0,
      } : null,
      // FOW normalised: fow.fow[] → flat array
      wicketsData: (inn.fow?.fow || []).map(w => ({
        batName: w.batsmanname,
        wktRuns: w.runs,
        wktNbr: w.ballnbr,   // ball number
        wktOver: w.overnbr,
      })),
    }));

    // Also build matchScoreDetails so the modal header populates
    const matchScoreDetails = {
      currentRunRate: rawInnings[rawInnings.length - 1]?.runrate || null,
      inningsScoreList: rawInnings.map(inn => ({
        batTeamName: inn.batteamname || '',
        score: inn.score,
        wickets: inn.wickets,
        overs: inn.overs,
      })),
    };

    console.log(`[scorecard] matchId=${req.params.matchId} | innings=${scoreCard.length} | inn0_batters=${scoreCard[0]?.batTeamDetails?.batsmenData?.length ?? 0}`);

    res.json({
      success: true,
      data: {
        ...data,
        scoreCard,
        matchScoreDetails,
        status: data.status || '',
      },
    });
  } catch (err) {
    console.error('Cricbuzz scorecard error:', err.message);
    res.status(502).json({ success: false, error: 'Cricbuzz API error', detail: err.message });
  }
});

// GET /api/cricbuzz/ipl — Filter only IPL matches from live
app.get('/api/cricbuzz/ipl', async (req, res) => {
  try {
    const data = await cricbuzz('/matches/v1/live');
    const ipl = [];
    (data.typeMatches || []).forEach(type => {
      (type.seriesMatches || []).forEach(series => {
        const wrapper = series.seriesAdWrapper || series;
        const name = (wrapper.seriesName || '').toLowerCase();
        if (name.includes('ipl') || name.includes('indian premier league')) {
          (wrapper.matches || []).forEach(m => {
            if (m.matchInfo) ipl.push(m);
          });
        }
      });
    });
    res.json({ success: true, count: ipl.length, matches: ipl });
  } catch (err) {
    res.status(502).json({ success: false, error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// EXISTING MONGODB ROUTES (unchanged)
// ═══════════════════════════════════════════════════════════════════════════

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cricbuzz: process.env.RAPIDAPI_KEY ? 'key loaded' : '⚠️ missing RAPIDAPI_KEY in .env',
  });
});

// ── Matches (MongoDB) ────────────────────────────────────────────────────

app.get('/api/matches/live', async (req, res) => {
  try {
    const matches = await Match.find({ status: { $in: ['live', 'upcoming'] } }).sort({ status: -1, date: -1 }).limit(10);
    res.json(matches);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/matches/history', async (req, res) => {
  try {
    const filter = { status: 'completed' };
    if (req.query.format) filter.format = req.query.format;
    const matches = await Match.find(filter).sort({ date: -1 }).limit(20);
    res.json(matches);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/matches/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json(match);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/matches/:id/scorecard', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .select('team1 team2 type format status batting bowling ballByBall fow crr');
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json(match);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/matches', async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json(match);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.patch('/api/matches/:id', async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!match) return res.status(404).json({ error: 'Match not found' });
    res.json(match);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.patch('/api/matches/:id/score', async (req, res) => {
  try {
    const { team, score, overs, crr, newBall } = req.body;
    const update = { crr };
    if (team === 1) { update['team1.score'] = score; update['team1.overs'] = overs; }
    else { update['team2.score'] = score; update['team2.overs'] = overs; }
    if (newBall) update.$push = { ballByBall: newBall };
    const match = await Match.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(match);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/matches/:id', async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Match deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Players (MongoDB) ────────────────────────────────────────────────────

app.get('/api/players', async (req, res) => {
  try {
    const type = req.query.type || 'batting';
    const sortField = type === 'batting' ? 'batting.runs' : 'bowling.wkts';
    const filter = req.query.country ? { country: req.query.country } : {};
    const players = await Player.find(filter).sort({ [sortField]: -1 }).limit(20);
    res.json(players.map((p, i) => ({ ...p.toObject(), rank: i + 1 })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/players/search', async (req, res) => {
  try {
    const players = await Player.find({ name: { $regex: req.query.q || '', $options: 'i' } }).limit(10);
    res.json(players);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/players/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/players', async (req, res) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json(player);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/players/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    res.json(player);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/players/:id', async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── Standings (MongoDB) ──────────────────────────────────────────────────

app.get('/api/standings', async (req, res) => {
  try {
    const tournament = req.query.tournament || 'ICC World Cup 2025';
    const standings = await Standing.find({ tournament }).sort({ pts: -1, nrr: -1 });
    res.json(standings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/standings', async (req, res) => {
  try {
    const s = await Standing.create(req.body);
    res.status(201).json(s);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.patch('/api/standings/:id', async (req, res) => {
  try {
    const s = await Standing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!s) return res.status(404).json({ error: 'Not found' });
    res.json(s);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── ICC Rankings (MongoDB) ───────────────────────────────────────────────

app.get('/api/icc', async (req, res) => {
  try {
    const { format = 'test', role = 'batting' } = req.query;
    const rankings = await ICCRanking.find({ format, role }).sort({ rank: 1 }).limit(20);
    res.json(rankings);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/icc', async (req, res) => {
  try {
    const r = await ICCRanking.create(req.body);
    res.status(201).json(r);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/icc', async (req, res) => {
  try {
    const { format, role, rankings } = req.body;
    await ICCRanking.deleteMany({ format, role });
    const docs = rankings.map((r, i) => ({ ...r, format, role, rank: i + 1 }));
    await ICCRanking.insertMany(docs);
    res.json({ message: `Updated ${docs.length} ICC rankings` });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── Bracket (MongoDB) ────────────────────────────────────────────────────

app.get('/api/bracket', async (req, res) => {
  try {
    const tournament = req.query.tournament || 'ICC World Cup 2025';
    const bracket = await Bracket.findOne({ tournament });
    if (!bracket) return res.status(404).json({ error: 'Bracket not found' });
    res.json(bracket);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/bracket', async (req, res) => {
  try {
    const bracket = await Bracket.create(req.body);
    res.status(201).json(bracket);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.patch('/api/bracket/:id/match', async (req, res) => {
  try {
    const { roundIdx, matchIdx, update } = req.body;
    const bracket = await Bracket.findById(req.params.id);
    if (!bracket) return res.status(404).json({ error: 'Bracket not found' });
    Object.assign(bracket.rounds[roundIdx].matches[matchIdx], update);
    await bracket.save();
    res.json(bracket);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// ── 404 ──────────────────────────────────────────────────────────────────

// Serve frontend for all non-API routes (required for page refresh on Render)
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🏏 CricPulse API v3 running on http://localhost:${PORT}`);
    console.log(`   MongoDB  : /api/matches  /api/players  /api/standings  /api/icc  /api/bracket`);
    console.log(`   Cricbuzz : /api/cricbuzz/live  /api/cricbuzz/upcoming  /api/cricbuzz/recent`);
    console.log(`   Cricbuzz : /api/cricbuzz/scorecard/:matchId  /api/cricbuzz/ipl`);
  });
}

module.exports = app; // for Jest