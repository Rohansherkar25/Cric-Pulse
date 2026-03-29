// ===========================
// CricPulse — app.js (v4)
// Live Scorecard Modal added
// ===========================

// Auto-detect API base: use same origin in production, localhost in dev
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : '/api';

// ── Mock Data ──────────────────────────────────────────────────────────────

const MOCK = {
  liveMatches: [
    { id: 1, type: 'T20 International', status: 'live', venue: 'Wankhede Stadium, Mumbai', team1: { name: 'IND', flag: '🇮🇳', score: '187/4', overs: '18.3' }, team2: { name: 'AUS', flag: '🇦🇺', score: '142/3', overs: '16.0' }, crr: 'CRR: 8.87' },
    { id: 2, type: 'ODI', status: 'live', venue: "Lord's Cricket Ground, London", team1: { name: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', score: '312/7', overs: '50.0' }, team2: { name: 'NZ', flag: '🇳🇿', score: '278/9', overs: '47.2' }, crr: 'CRR: 5.93' },
    { id: 3, type: 'Test — Day 3', status: 'live', venue: 'MCG, Melbourne', team1: { name: 'SA', flag: '🇿🇦', score: '430/8', overs: '110.4' }, team2: { name: 'PAK', flag: '🇵🇰', score: '210/3', overs: '68.0' }, crr: 'CRR: 3.08' },
    { id: 4, type: 'T20 — IPL', status: 'upcoming', venue: 'Eden Gardens, Kolkata', team1: { name: 'KKR', flag: '🟣', score: 'TBD', overs: '' }, team2: { name: 'MI', flag: '🔵', score: 'TBD', overs: '' }, crr: 'Starts in 2h 15m' },
    { id: 5, type: 'ODI', status: 'completed', venue: 'SCG, Sydney', team1: { name: 'WI', flag: '🏝️', score: '254/9', overs: '50.0' }, team2: { name: 'SL', flag: '🇱🇰', score: '231/10', overs: '46.3' }, crr: 'WI won by 23 runs' },
  ],

  scorecards: [
    {
      match: 'IND vs AUS — T20I, Wankhede', status: 'live',
      team1: { name: 'INDIA', flag: '🇮🇳', score: '187/4', overs: '18.3' },
      team2: { name: 'AUSTRALIA', flag: '🇦🇺', score: '142/3', overs: '16.0' },
      crr: '10.11', rrr: '14.23',
      batting: [
        { name: 'Rohit Sharma', runs: 62, balls: 38, fours: 6, sixes: 3, sr: 163.2, status: 'out', how: 'c Maxwell b Starc' },
        { name: 'Virat Kohli', runs: 78, balls: 52, fours: 7, sixes: 2, sr: 150.0, status: 'batting', how: 'not out' },
        { name: 'Suryakumar Yadav', runs: 31, balls: 16, fours: 2, sixes: 3, sr: 193.8, status: 'batting', how: 'not out' },
        { name: 'KL Rahul', runs: 9, balls: 7, fours: 1, sixes: 0, sr: 128.6, status: 'out', how: 'b Cummins' },
        { name: 'Hardik Pandya', runs: 5, balls: 3, fours: 0, sixes: 1, sr: 166.7, status: 'out', how: 'run out' },
      ],
      bowling: [
        { name: 'Pat Cummins', overs: '4.0', maiden: 0, runs: 38, wkts: 2, econ: 9.5 },
        { name: 'Mitchell Starc', overs: '3.3', maiden: 0, runs: 42, wkts: 1, econ: 12.0 },
        { name: 'Adam Zampa', overs: '4.0', maiden: 0, runs: 29, wkts: 0, econ: 7.3 },
        { name: 'Glenn Maxwell', overs: '3.0', maiden: 0, runs: 31, wkts: 1, econ: 10.3 },
        { name: 'Josh Hazlewood', overs: '4.0', maiden: 0, runs: 40, wkts: 0, econ: 10.0 },
      ],
      ballByBall: [
        { over: 16, balls: ['1', 'W', '4', '2', '6', '1'] },
        { over: 17, balls: ['6', '1', '4', '2', '1', 'W'] },
        { over: 18, balls: ['4', '6', '1', '2', 'WD', '1'] },
      ],
      fow: [
        { score: '32/1', name: 'Shubman Gill', over: '3.2' },
        { score: '89/2', name: 'Rohit Sharma', over: '9.4' },
        { score: '112/3', name: 'KL Rahul', over: '13.1' },
        { score: '159/4', name: 'Hardik Pandya', over: '16.5' },
      ],
    },
    {
      match: "ENG vs NZ — ODI, Lord's", status: 'live',
      team1: { name: 'ENGLAND', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', score: '312/7', overs: '50.0' },
      team2: { name: 'NEW ZEALAND', flag: '🇳🇿', score: '278/9', overs: '47.2' },
      crr: '5.93', rrr: '—',
      batting: [
        { name: 'Will Young', runs: 88, balls: 102, fours: 9, sixes: 1, sr: 86.3, status: 'batting', how: 'not out' },
        { name: 'Tom Latham', runs: 54, balls: 67, fours: 5, sixes: 0, sr: 80.6, status: 'out', how: 'c Root b Archer' },
        { name: 'Kane Williamson', runs: 41, balls: 55, fours: 3, sixes: 0, sr: 74.5, status: 'out', how: 'b Woakes' },
        { name: 'Daryl Mitchell', runs: 49, balls: 42, fours: 4, sixes: 2, sr: 116.7, status: 'batting', how: 'not out' },
        { name: 'Glenn Phillips', runs: 12, balls: 9, fours: 1, sixes: 1, sr: 133.3, status: 'out', how: 'lbw b Rashid' },
      ],
      bowling: [
        { name: 'Jofra Archer', overs: '9.2', maiden: 1, runs: 49, wkts: 3, econ: 5.3 },
        { name: 'Chris Woakes', overs: '10.0', maiden: 0, runs: 54, wkts: 2, econ: 5.4 },
        { name: 'Adil Rashid', overs: '10.0', maiden: 0, runs: 48, wkts: 2, econ: 4.8 },
        { name: 'Mark Wood', overs: '9.0', maiden: 0, runs: 58, wkts: 1, econ: 6.4 },
        { name: 'Joe Root', overs: '9.0', maiden: 0, runs: 47, wkts: 1, econ: 5.2 },
      ],
      ballByBall: [
        { over: 45, balls: ['1', '2', '4', 'W', '1', '6'] },
        { over: 46, balls: ['0', '1', '1', 'W', '4', '2'] },
        { over: 47, balls: ['6', '1', 'W', '2'] },
      ],
      fow: [
        { score: '58/1', name: 'Devon Conway', over: '12.3' },
        { score: '142/2', name: 'Tom Latham', over: '27.5' },
        { score: '178/3', name: 'Kane Williamson', over: '33.2' },
        { score: '214/4', name: 'Glenn Phillips', over: '38.4' },
        { score: '241/5', name: 'Michael Bracewell', over: '43.1' },
      ],
    },
    {
      match: 'SA vs PAK — Test, MCG', status: 'live',
      team1: { name: 'SOUTH AFRICA', flag: '🇿🇦', score: '430/8', overs: '110.4' },
      team2: { name: 'PAKISTAN', flag: '🇵🇰', score: '210/3', overs: '68.0' },
      crr: '3.08', rrr: '—',
      batting: [
        { name: 'Imam-ul-Haq', runs: 74, balls: 142, fours: 7, sixes: 0, sr: 52.1, status: 'batting', how: 'not out' },
        { name: 'Babar Azam', runs: 61, balls: 118, fours: 6, sixes: 0, sr: 51.7, status: 'batting', how: 'not out' },
        { name: 'Abdullah Shafique', runs: 34, balls: 89, fours: 4, sixes: 0, sr: 38.2, status: 'out', how: 'c Bavuma b Rabada' },
        { name: 'Shan Masood', runs: 28, balls: 67, fours: 3, sixes: 0, sr: 41.8, status: 'out', how: 'b Nortje' },
      ],
      bowling: [
        { name: 'Kagiso Rabada', overs: '18.0', maiden: 3, runs: 52, wkts: 1, econ: 2.9 },
        { name: 'Anrich Nortje', overs: '17.0', maiden: 2, runs: 48, wkts: 1, econ: 2.8 },
        { name: 'Marco Jansen', overs: '15.0', maiden: 1, runs: 44, wkts: 1, econ: 2.9 },
        { name: 'Keshav Maharaj', overs: '18.0', maiden: 4, runs: 41, wkts: 0, econ: 2.3 },
      ],
      ballByBall: [
        { over: 66, balls: ['0', '1', '0', '1', '0', '4'] },
        { over: 67, balls: ['0', '0', '1', '0', '0', '1'] },
        { over: 68, balls: ['1', '0', '0', '2'] },
      ],
      fow: [
        { score: '62/1', name: 'Shan Masood', over: '19.3' },
        { score: '116/2', name: 'Abdullah Shafique', over: '39.1' },
        { score: '134/3', name: 'Saud Shakeel', over: '44.2' },
      ],
    },
  ],

  players: [
    {
      rank: 1, name: 'Virat Kohli', country: 'India', runs: 14873, avg: 57.32, sr: 93.4, hs: 183, hundreds: 50, wkts: 4, bavg: 92.0, econ: 5.1, color: '#e11d48',
      role: 'Batsman', dob: 'Nov 5, 1988', debut: 'Aug 18, 2008', tests: 113, odis: 292, t20s: 125, formats: { test: { runs: 9230, avg: 49.95 }, odi: { runs: 13906, avg: 58.18 }, t20: { runs: 4037, avg: 52.43 } }, recentScores: [122, 0, 44, 183, 76, 31, 89]
    },
    {
      rank: 2, name: 'Rohit Sharma', country: 'India', runs: 10709, avg: 48.61, sr: 89.2, hs: 264, hundreds: 30, wkts: 8, bavg: 42.0, econ: 5.3, color: '#2563eb',
      role: 'Batsman', dob: 'Apr 30, 1987', debut: 'Jun 23, 2007', tests: 62, odis: 264, t20s: 159, formats: { test: { runs: 3877, avg: 40.6 }, odi: { runs: 10709, avg: 48.6 }, t20: { runs: 4231, avg: 32.1 } }, recentScores: [56, 83, 14, 176, 23, 119, 62]
    },
    {
      rank: 3, name: 'Joe Root', country: 'England', runs: 12847, avg: 51.73, sr: 82.1, hs: 254, hundreds: 34, wkts: 61, bavg: 41.7, econ: 3.4, color: '#16a34a',
      role: 'Batsman', dob: 'Dec 30, 1990', debut: 'Dec 13, 2012', tests: 145, odis: 163, t20s: 32, formats: { test: { runs: 12847, avg: 51.7 }, odi: { runs: 6971, avg: 49.1 }, t20: { runs: 893, avg: 25.5 } }, recentScores: [84, 153, 31, 228, 7, 91, 111]
    },
    {
      rank: 4, name: 'Steve Smith', country: 'Australia', runs: 9294, avg: 61.80, sr: 79.8, hs: 239, hundreds: 32, wkts: 17, bavg: 60.1, econ: 3.1, color: '#d97706',
      role: 'Batsman', dob: 'Jun 2, 1989', debut: 'Mar 1, 2010', tests: 106, odis: 152, t20s: 66, formats: { test: { runs: 9294, avg: 61.8 }, odi: { runs: 4162, avg: 43.0 }, t20: { runs: 1074, avg: 22.4 } }, recentScores: [101, 36, 239, 18, 55, 88, 131]
    },
    {
      rank: 5, name: 'Babar Azam', country: 'Pakistan', runs: 9840, avg: 56.12, sr: 88.6, hs: 158, hundreds: 30, wkts: 0, bavg: 0, econ: 0, color: '#0891b2',
      role: 'Batsman', dob: 'Oct 15, 1994', debut: 'May 22, 2015', tests: 57, odis: 116, t20s: 106, formats: { test: { runs: 3613, avg: 45.7 }, odi: { runs: 5488, avg: 58.6 }, t20: { runs: 4223, avg: 44.4 } }, recentScores: [77, 158, 44, 102, 22, 61, 88]
    },
    {
      rank: 6, name: 'Jasprit Bumrah', country: 'India', runs: 280, avg: 6.2, sr: 72.0, hs: 35, hundreds: 0, wkts: 350, bavg: 20.14, econ: 4.32, color: '#e11d48',
      role: 'Bowler', dob: 'Dec 6, 1993', debut: 'Jan 23, 2016', tests: 38, odis: 86, t20s: 72, formats: { test: { wkts: 159, avg: 20.2 }, odi: { wkts: 149, avg: 24.3 }, t20: { wkts: 79, avg: 18.1 } }, recentScores: [2, 0, 4, 1, 35, 1, 0]
    },
    {
      rank: 7, name: 'Pat Cummins', country: 'Australia', runs: 1203, avg: 15.4, sr: 81.0, hs: 66, hundreds: 0, wkts: 287, bavg: 21.60, econ: 4.72, color: '#d97706',
      role: 'Bowler', dob: 'May 8, 1993', debut: 'Nov 3, 2011', tests: 52, odis: 74, t20s: 56, formats: { test: { wkts: 233, avg: 20.8 }, odi: { wkts: 96, avg: 30.1 }, t20: { wkts: 51, avg: 24.5 } }, recentScores: [6, 31, 14, 2, 66, 4, 12]
    },
    {
      rank: 8, name: 'Kagiso Rabada', country: 'South Africa', runs: 620, avg: 11.2, sr: 88.0, hs: 31, hundreds: 0, wkts: 312, bavg: 22.41, econ: 4.98, color: '#059669',
      role: 'Bowler', dob: 'May 25, 1995', debut: 'Jan 7, 2015', tests: 56, odis: 90, t20s: 77, formats: { test: { wkts: 261, avg: 22.0 }, odi: { wkts: 166, avg: 26.7 }, t20: { wkts: 112, avg: 22.5 } }, recentScores: [5, 1, 31, 0, 12, 8, 3]
    },
  ],

  iccRankings: {
    test: {
      batting: [
        { rank: 1, name: 'Steve Smith', country: 'Australia', rating: 904, change: '+0' },
        { rank: 2, name: 'Joe Root', country: 'England', rating: 891, change: '+1' },
        { rank: 3, name: 'Marnus Labuschagne', country: 'Australia', rating: 878, change: '-1' },
        { rank: 4, name: 'Kane Williamson', country: 'New Zealand', rating: 841, change: '+0' },
        { rank: 5, name: 'Virat Kohli', country: 'India', rating: 815, change: '+2' },
        { rank: 6, name: 'Babar Azam', country: 'Pakistan', rating: 802, change: '-1' },
        { rank: 7, name: 'Ben Duckett', country: 'England', rating: 784, change: '+3' },
        { rank: 8, name: 'Shubman Gill', country: 'India', rating: 762, change: '+1' },
      ],
      bowling: [
        { rank: 1, name: 'Jasprit Bumrah', country: 'India', rating: 887, change: '+0' },
        { rank: 2, name: 'Pat Cummins', country: 'Australia', rating: 871, change: '+1' },
        { rank: 3, name: 'Kagiso Rabada', country: 'South Africa', rating: 843, change: '+0' },
        { rank: 4, name: 'James Anderson', country: 'England', rating: 820, change: '-1' },
        { rank: 5, name: 'R. Ashwin', country: 'India', rating: 798, change: '+0' },
        { rank: 6, name: 'Stuart Broad', country: 'England', rating: 765, change: '+2' },
        { rank: 7, name: 'Nathan Lyon', country: 'Australia', rating: 741, change: '-1' },
        { rank: 8, name: 'Shaheen Afridi', country: 'Pakistan', rating: 718, change: '+1' },
      ],
      allrounder: [
        { rank: 1, name: 'Ravindra Jadeja', country: 'India', rating: 439, change: '+0' },
        { rank: 2, name: 'Ben Stokes', country: 'England', rating: 412, change: '+1' },
        { rank: 3, name: 'Cameron Green', country: 'Australia', rating: 388, change: '+0' },
        { rank: 4, name: 'Shakib Al Hasan', country: 'Bangladesh', rating: 371, change: '-1' },
        { rank: 5, name: 'Jason Holder', country: 'West Indies', rating: 342, change: '+2' },
      ],
      team: [
        { rank: 1, name: 'Australia', flag: '🇦🇺', rating: 124, change: '+0' },
        { rank: 2, name: 'India', flag: '🇮🇳', rating: 121, change: '+1' },
        { rank: 3, name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 108, change: '-1' },
        { rank: 4, name: 'New Zealand', flag: '🇳🇿', rating: 101, change: '+0' },
        { rank: 5, name: 'South Africa', flag: '🇿🇦', rating: 96, change: '+0' },
        { rank: 6, name: 'Pakistan', flag: '🇵🇰', rating: 88, change: '+1' },
      ],
    },
    odi: {
      batting: [
        { rank: 1, name: 'Virat Kohli', country: 'India', rating: 871, change: '+1' },
        { rank: 2, name: 'Babar Azam', country: 'Pakistan', rating: 858, change: '-1' },
        { rank: 3, name: 'Rohit Sharma', country: 'India', rating: 831, change: '+0' },
        { rank: 4, name: 'Joe Root', country: 'England', rating: 812, change: '+2' },
        { rank: 5, name: 'Shubman Gill', country: 'India', rating: 798, change: '+1' },
      ],
      bowling: [
        { rank: 1, name: 'Jasprit Bumrah', country: 'India', rating: 814, change: '+0' },
        { rank: 2, name: 'Trent Boult', country: 'New Zealand', rating: 786, change: '+1' },
        { rank: 3, name: 'Shaheen Afridi', country: 'Pakistan', rating: 761, change: '-1' },
        { rank: 4, name: 'Mitchell Starc', country: 'Australia', rating: 742, change: '+0' },
        { rank: 5, name: 'Jofra Archer', country: 'England', rating: 718, change: '+2' },
      ],
      allrounder: [
        { rank: 1, name: 'Shakib Al Hasan', country: 'Bangladesh', rating: 392, change: '+0' },
        { rank: 2, name: 'Hardik Pandya', country: 'India', rating: 374, change: '+1' },
        { rank: 3, name: 'Mitchell Marsh', country: 'Australia', rating: 341, change: '-1' },
      ],
      team: [
        { rank: 1, name: 'India', flag: '🇮🇳', rating: 118, change: '+1' },
        { rank: 2, name: 'Australia', flag: '🇦🇺', rating: 114, change: '-1' },
        { rank: 3, name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 107, change: '+0' },
        { rank: 4, name: 'Pakistan', flag: '🇵🇰', rating: 98, change: '+1' },
        { rank: 5, name: 'New Zealand', flag: '🇳🇿', rating: 95, change: '-1' },
      ],
    },
    t20: {
      batting: [
        { rank: 1, name: 'Suryakumar Yadav', country: 'India', rating: 902, change: '+0' },
        { rank: 2, name: 'Babar Azam', country: 'Pakistan', rating: 867, change: '+1' },
        { rank: 3, name: 'Mohammad Rizwan', country: 'Pakistan', rating: 843, change: '-1' },
        { rank: 4, name: 'Travis Head', country: 'Australia', rating: 811, change: '+2' },
        { rank: 5, name: 'Virat Kohli', country: 'India', rating: 798, change: '+0' },
      ],
      bowling: [
        { rank: 1, name: 'Jasprit Bumrah', country: 'India', rating: 844, change: '+0' },
        { rank: 2, name: 'Rashid Khan', country: 'Afghanistan', rating: 821, change: '+0' },
        { rank: 3, name: 'Adil Rashid', country: 'England', rating: 798, change: '+1' },
        { rank: 4, name: 'Wanindu Hasaranga', country: 'Sri Lanka', rating: 774, change: '-1' },
        { rank: 5, name: 'Shaheen Afridi', country: 'Pakistan', rating: 741, change: '+1' },
      ],
      allrounder: [
        { rank: 1, name: 'Hardik Pandya', country: 'India', rating: 411, change: '+0' },
        { rank: 2, name: 'Shakib Al Hasan', country: 'Bangladesh', rating: 378, change: '+1' },
        { rank: 3, name: 'Liam Livingstone', country: 'England', rating: 352, change: '-1' },
      ],
      team: [
        { rank: 1, name: 'India', flag: '🇮🇳', rating: 272, change: '+0' },
        { rank: 2, name: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 268, change: '+1' },
        { rank: 3, name: 'Australia', flag: '🇦🇺', rating: 261, change: '-1' },
        { rank: 4, name: 'Pakistan', flag: '🇵🇰', rating: 254, change: '+0' },
        { rank: 5, name: 'South Africa', flag: '🇿🇦', rating: 241, change: '+2' },
      ],
    },
  },

  bracket: {
    'ICC World Cup 2025': {
      rounds: [
        {
          name: 'Group Stage',
          matches: [
            { t1: 'IND', f1: '🇮🇳', s1: '204/4', t2: 'PAK', f2: '🇵🇰', s2: '173/9', winner: 'IND', status: 'completed' },
            { t1: 'AUS', f1: '🇦🇺', s1: '287/6', t2: 'ENG', f2: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', s2: '241/8', winner: 'AUS', status: 'completed' },
            { t1: 'NZ', f1: '🇳🇿', s1: '289/7', t2: 'SA', f2: '🇿🇦', s2: '271/9', winner: 'NZ', status: 'completed' },
            { t1: 'SL', f1: '🇱🇰', s1: '201/8', t2: 'WI', f2: '🏝️', s2: '198/7', winner: 'SL', status: 'completed' },
          ]
        },
        {
          name: 'Semi-Finals',
          matches: [
            { t1: 'IND', f1: '🇮🇳', s1: '220/3', t2: 'AUS', f2: '🇦🇺', s2: '198/8', winner: 'IND', status: 'completed' },
            { t1: 'NZ', f1: '🇳🇿', s1: '', t2: 'ENG', f2: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', s2: '', winner: '', status: 'live' },
          ]
        },
        {
          name: 'Final',
          matches: [
            { t1: 'IND', f1: '🇮🇳', s1: '', t2: 'TBD', f2: '🏆', s2: '', winner: '', status: 'upcoming' },
          ]
        },
      ]
    },
  },

  standings: [
    { pos: 1, team: 'India', flag: '🇮🇳', p: 9, w: 7, l: 1, nr: 1, nrr: '+1.432', pts: 15 },
    { pos: 2, team: 'Australia', flag: '🇦🇺', p: 9, w: 6, l: 2, nr: 1, nrr: '+0.871', pts: 13 },
    { pos: 3, team: 'England', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', p: 9, w: 6, l: 3, nr: 0, nrr: '+0.541', pts: 12 },
    { pos: 4, team: 'New Zealand', flag: '🇳🇿', p: 9, w: 5, l: 3, nr: 1, nrr: '+0.218', pts: 11 },
    { pos: 5, team: 'Pakistan', flag: '🇵🇰', p: 9, w: 5, l: 4, nr: 0, nrr: '-0.102', pts: 10 },
    { pos: 6, team: 'South Africa', flag: '🇿🇦', p: 9, w: 4, l: 4, nr: 1, nrr: '+0.091', pts: 9 },
    { pos: 7, team: 'Sri Lanka', flag: '🇱🇰', p: 9, w: 3, l: 5, nr: 1, nrr: '-0.307', pts: 7 },
    { pos: 8, team: 'West Indies', flag: '🏝️', p: 9, w: 2, l: 6, nr: 1, nrr: '-0.812', pts: 5 },
    { pos: 9, team: 'Bangladesh', flag: '🇧🇩', p: 9, w: 1, l: 7, nr: 1, nrr: '-0.944', pts: 3 },
    { pos: 10, team: 'Afghanistan', flag: '🇦🇫', p: 9, w: 1, l: 8, nr: 0, nrr: '-1.232', pts: 2 },
  ],

  matchHistory: [
    { id: 1, team1: 'India', team2: 'Australia', format: 't20', date: '24 Mar 2025', venue: 'Wankhede, Mumbai', result: 'India won by 24 runs', winner: 'IND', score1: '204/4', score2: '180/7' },
    { id: 2, team1: 'England', team2: 'Pakistan', format: 'odi', date: '22 Mar 2025', venue: "Lord's, London", result: 'England won by 3 wkts', winner: 'ENG', score1: '278/9', score2: '281/7' },
    { id: 3, team1: 'Australia', team2: 'South Africa', format: 'test', date: '18 Mar 2025', venue: 'MCG, Melbourne', result: 'Australia won by innings', winner: 'AUS', score1: '540/8d', score2: '210 & 302' },
    { id: 4, team1: 'New Zealand', team2: 'Sri Lanka', format: 'odi', date: '15 Mar 2025', venue: 'Eden Park, Auckland', result: 'NZ won by 67 runs', winner: 'NZ', score1: '330/6', score2: '263/10' },
    { id: 5, team1: 'India', team2: 'England', format: 't20', date: '12 Mar 2025', venue: 'Edgbaston, Birmingham', result: 'England won by 5 runs', winner: 'ENG', score1: '189/6', score2: '194/5' },
    { id: 6, team1: 'Pakistan', team2: 'West Indies', format: 'test', date: '8 Mar 2025', venue: 'National Stadium, Karachi', result: 'Pakistan won by 9 wkts', winner: 'PAK', score1: '310 & 52/1', score2: '198 & 163' },
    { id: 7, team1: 'South Africa', team2: 'Bangladesh', format: 'odi', date: '5 Mar 2025', venue: 'Newlands, Cape Town', result: 'SA won by 120 runs', winner: 'SA', score1: '358/5', score2: '238/10' },
    { id: 8, team1: 'Australia', team2: 'India', format: 't20', date: '2 Mar 2025', venue: 'SCG, Sydney', result: 'India won by 7 wickets', winner: 'IND', score1: '152/9', score2: '155/3' },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────

// Smart fetch: tries the real backend, falls back to MOCK if unavailable
async function fetchAPI(endpoint, mockKey) {
  try {
    const res = await fetch(`${API_BASE}/${endpoint}`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    // Cricbuzz routes return { success, matches } — unwrap
    if (json && json.matches !== undefined) return json.matches;
    // MongoDB routes return plain arrays
    return json;
  } catch (e) {
    console.warn(`[CricPulse] API ${endpoint} failed (${e.message}), using mock data`);
    return MOCK[mockKey];
  }
}

function getRankClass(r) { return r === 1 ? 'gold' : r === 2 ? 'silver' : r === 3 ? 'bronze' : ''; }
function getRankEmoji(r) { return r === 1 ? '🥇' : r === 2 ? '🥈' : r === 3 ? '🥉' : r; }

// ── Navigation ─────────────────────────────────────────────────────────────

const sectionMeta = {
  live: { title: 'Live Scores', subtitle: 'Real-time match updates' },
  scorecard: { title: 'Scorecard', subtitle: 'Ball-by-ball match details' },
  players: { title: 'Player Stats', subtitle: 'Batting & bowling rankings' },
  profile: { title: 'Player Profile', subtitle: 'Detailed player career stats' },
  icc: { title: 'ICC Rankings', subtitle: 'Official world rankings' },
  bracket: { title: 'Tournament', subtitle: 'Bracket & match results' },
  standings: { title: 'Team Standings', subtitle: 'Tournament points table' },
  history: { title: 'Match History', subtitle: 'Past results & scorecards' },
};

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const sec = item.dataset.section;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${sec}`).classList.add('active');
    const m = sectionMeta[sec];
    document.getElementById('pageTitle').textContent = m.title;
    document.getElementById('pageSubtitle').textContent = m.subtitle;
  });
});

document.getElementById('refreshBtn').addEventListener('click', function () {
  this.classList.add('spinning');
  initAll();
  setTimeout(() => this.classList.remove('spinning'), 700);
});

// ── Live Matches ───────────────────────────────────────────────────────────

async function renderMatches() {
  const grid = document.getElementById('matchesGrid');
  grid.innerHTML = '<div style="padding:40px;text-align:center;color:var(--text3)"><i class="fas fa-spinner fa-spin"></i> Loading live matches...</div>';

  // Try real Cricbuzz API first, fall back to MongoDB, then MOCK
  let data = [];
  try {
    const res = await fetch(`${API_BASE}/cricbuzz/live`, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const json = await res.json();
      data = json.matches || [];
    }
  } catch (e) { console.warn('Cricbuzz live failed, falling back:', e.message); }

  // Fallback to MongoDB live matches
  if (!data.length) {
    try {
      const res = await fetch(`${API_BASE}/matches/live`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) data = await res.json();
    } catch (e) { console.warn('MongoDB live failed, using mock:', e.message); }
  }

  // Last resort: mock data
  if (!data.length) data = MOCK.liveMatches;

  // Normalise: Cricbuzz uses seriesName+format, MongoDB uses type+status
  grid.innerHTML = data.length ? data.map(m => {
    const statusLabel = (m.status || 'live').toLowerCase();
    const isLive = statusLabel === 'live' || (m.status && !['upcoming', 'completed'].includes(statusLabel));
    const type = m.seriesName || m.type || 'Cricket';
    const flag1 = m.team1.flag || '🏏';
    const flag2 = m.team2.flag || '🏏';
    const score1 = m.team1.score || 'TBD';
    const score2 = m.team2.score || 'TBD';
    const overs1 = m.team1.overs || '';
    const overs2 = m.team2.overs || '';
    const crr = m.crr || m.startTime || '';
    const clickAttr = m.matchId ? `onclick="openScorecardModal('${m.matchId}', '${m.team1.name}', '${m.team2.name}', '${score1}', '${overs1}', '${score2}', '${overs2}', '${crr}', '${m.venue || 'TBD'}', ${isLive})"` : '';
    return `
    <div class="match-card ${isLive ? 'live-card' : ''}" ${clickAttr} style="${m.matchId ? 'cursor:pointer' : ''}">
      <div class="match-meta">
        <span class="match-type">${type}</span>
        <span class="match-status ${isLive ? 'live' : statusLabel}">${isLive ? 'LIVE' : statusLabel.toUpperCase()}</span>
        ${m.matchId ? `<span style="font-family:var(--font-mono);font-size:9px;color:var(--text3);margin-left:auto"><i class="fas fa-arrow-up-right-from-square"></i> SCORECARD</span>` : ''}
      </div>
      <div class="teams">
        <div class="team-row">
          <div class="team-info"><div class="team-flag">${flag1}</div><span class="team-name">${m.team1.name}</span></div>
          <div class="team-score"><div class="score-main">${score1}</div>${overs1 ? `<div class="score-overs">${overs1} ov</div>` : ''}</div>
        </div>
        <div class="match-divider"></div>
        <div class="team-row">
          <div class="team-info"><div class="team-flag">${flag2}</div><span class="team-name">${m.team2.name}</span></div>
          <div class="team-score"><div class="score-main">${score2}</div>${overs2 ? `<div class="score-overs">${overs2} ov</div>` : ''}</div>
        </div>
      </div>
      <div class="match-footer">
        <span class="match-venue"><i class="fas fa-location-dot"></i> ${m.venue || 'TBD'}</span>
        <span class="crr-badge">${crr}</span>
      </div>
    </div>`;
  }).join('')
    : '<div style="padding:40px;text-align:center;color:var(--text3)">No live matches right now. Check back soon!</div>';
}

// ── Scorecard ──────────────────────────────────────────────────────────────

function renderScorecard(idx) {
  const sc = MOCK.scorecards[idx];
  const el = document.getElementById('scorecardContent');

  const battingRows = sc.batting.map(b => `
    <tr class="${b.status === 'batting' ? 'batting-current' : ''} ${b.status === 'out' ? 'out-row' : ''}">
      <td>
        <div style="display:flex;flex-direction:column">
          <span style="font-weight:500">${b.name} ${b.status === 'batting' ? '<span style="color:var(--accent);font-size:10px">★ batting</span>' : ''}</span>
          <span style="font-size:11px;color:var(--text3)">${b.status === 'out' ? b.how : b.how}</span>
        </div>
      </td>
      <td class="highlight">${b.runs}</td>
      <td>${b.balls}</td>
      <td>${b.fours}</td>
      <td>${b.sixes}</td>
      <td>${b.sr}</td>
    </tr>
  `).join('');

  const bowlingRows = sc.bowling.map(b => `
    <tr>
      <td style="font-weight:500">${b.name}</td>
      <td>${b.overs}</td>
      <td>${b.maiden}</td>
      <td>${b.runs}</td>
      <td class="highlight">${b.wkts}</td>
      <td>${b.econ}</td>
    </tr>
  `).join('');

  const ballByBall = sc.ballByBall.map(over => `
    <div class="over-block">
      <span class="over-label">Ov ${over.over}</span>
      ${over.balls.map(ball => {
    let cls = 'run';
    if (ball === 'W') cls = 'wicket';
    else if (ball === '6') cls = 'six';
    else if (ball === '4') cls = 'four';
    else if (ball === '0') cls = 'dot';
    else if (ball === 'WD') cls = 'wide';
    else if (ball === 'NB') cls = 'nb';
    return `<div class="ball ${cls}">${ball}</div>`;
  }).join('')}
    </div>
  `).join('');

  const fow = sc.fow.map(f => `
    <div class="fow-item">
      <div class="fow-score">${f.score}</div>
      <div class="fow-name">${f.name}</div>
      <div class="fow-over">Ov ${f.over}</div>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="sc-header">
      <div class="sc-team">
        <span class="sc-flag">${sc.team1.flag}</span>
        <span class="sc-tname">${sc.team1.name}</span>
        <span class="sc-score">${sc.team1.score} <small>(${sc.team1.overs} ov)</small></span>
      </div>
      <div class="sc-vs">
        <span class="live-badge"><span class="pulse-dot"></span> LIVE</span>
        <div class="sc-crr">CRR: ${sc.crr}</div>
        ${sc.rrr !== '—' ? `<div class="sc-rrr">RRR: ${sc.rrr}</div>` : ''}
      </div>
      <div class="sc-team right">
        <span class="sc-flag">${sc.team2.flag}</span>
        <span class="sc-tname">${sc.team2.name}</span>
        <span class="sc-score">${sc.team2.score} <small>(${sc.team2.overs} ov)</small></span>
      </div>
    </div>

    <div class="sc-section-title">🏏 Batting — ${sc.team1.name}</div>
    <div class="table-wrap" style="margin-bottom:20px">
      <table class="stat-table">
        <thead><tr><th>Batter</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th></tr></thead>
        <tbody>${battingRows}</tbody>
      </table>
    </div>

    <div class="sc-section-title">🎳 Bowling — ${sc.team2.name}</div>
    <div class="table-wrap" style="margin-bottom:20px">
      <table class="stat-table">
        <thead><tr><th>Bowler</th><th>O</th><th>M</th><th>R</th><th>W</th><th>Econ</th></tr></thead>
        <tbody>${bowlingRows}</tbody>
      </table>
    </div>

    <div class="sc-section-title">📊 Ball by Ball</div>
    <div class="ball-by-ball">${ballByBall}</div>

    <div class="sc-section-title" style="margin-top:24px">🔻 Fall of Wickets</div>
    <div class="fow-list">${fow}</div>
  `;
}

document.getElementById('scorecardMatchSelect').addEventListener('change', function () {
  renderScorecard(parseInt(this.value));
});

// ── Player Stats ───────────────────────────────────────────────────────────

function renderPlayerStats(type) {
  const data = MOCK.players;
  const maxVal = Math.max(...data.map(p => type === 'batting' ? p.runs : p.wkts));
  const head = document.getElementById('playerTableHead');
  const body = document.getElementById('playerTableBody');

  if (type === 'batting') {
    head.innerHTML = `<tr><th>#</th><th>Player</th><th>Runs</th><th>Avg</th><th>SR</th><th>HS</th><th>100s</th><th>Form</th></tr>`;
    body.innerHTML = data.map(p => `
      <tr>
        <td><span class="rank-badge ${getRankClass(p.rank)}">${getRankEmoji(p.rank)}</span></td>
        <td><div class="player-cell"><div class="player-avatar" style="background:${p.color}">${p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div><div><div class="player-name">${p.name}</div><div class="player-country">${p.country}</div></div></div></td>
        <td class="highlight">${p.runs.toLocaleString()}</td>
        <td>${p.avg}</td><td>${p.sr}</td><td>${p.hs}</td><td>${p.hundreds}</td>
        <td><div class="bar-wrap"><div class="mini-bar"><div class="mini-bar-fill" style="width:${(p.runs / maxVal * 100).toFixed(1)}%"></div></div></div></td>
      </tr>`).join('');
  } else {
    const bowlers = data.filter(p => p.wkts > 0);
    const maxW = Math.max(...bowlers.map(p => p.wkts));
    head.innerHTML = `<tr><th>#</th><th>Player</th><th>Wkts</th><th>Avg</th><th>Econ</th><th>Form</th></tr>`;
    body.innerHTML = bowlers.map((p, i) => `
      <tr>
        <td><span class="rank-badge ${getRankClass(i + 1)}">${getRankEmoji(i + 1)}</span></td>
        <td><div class="player-cell"><div class="player-avatar" style="background:${p.color}">${p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div><div><div class="player-name">${p.name}</div><div class="player-country">${p.country}</div></div></div></td>
        <td class="highlight">${p.wkts}</td><td>${p.bavg}</td><td>${p.econ}</td>
        <td><div class="bar-wrap"><div class="mini-bar"><div class="mini-bar-fill" style="width:${(p.wkts / maxW * 100).toFixed(1)}%;background:linear-gradient(90deg,var(--red),var(--purple))"></div></div></div></td>
      </tr>`).join('');
  }
}

document.querySelectorAll('.stat-tab[data-type]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.stat-tab[data-type]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderPlayerStats(btn.dataset.type);
  });
});

// ── Player Profile ─────────────────────────────────────────────────────────

const profileInput = document.getElementById('profileSearchInput');
const profileSugg = document.getElementById('profileSuggestions');
const profileCard = document.getElementById('profileCard');

profileInput.addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();
  if (!q) { profileSugg.classList.remove('open'); return; }
  const matches = MOCK.players.filter(p => p.name.toLowerCase().includes(q) || p.country.toLowerCase().includes(q));
  if (!matches.length) { profileSugg.classList.remove('open'); return; }
  profileSugg.innerHTML = matches.map(p => `
    <div class="suggestion-item" data-idx="${MOCK.players.indexOf(p)}">
      <div class="player-avatar" style="background:${p.color};width:26px;height:26px;font-size:10px">${p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
      <div><div style="font-weight:500">${p.name}</div><div style="font-size:11px;color:var(--text3)">${p.country} · ${p.role}</div></div>
    </div>`).join('');
  profileSugg.classList.add('open');
});

profileSugg.addEventListener('click', e => {
  const item = e.target.closest('.suggestion-item');
  if (!item) return;
  const p = MOCK.players[parseInt(item.dataset.idx)];
  profileInput.value = p.name;
  profileSugg.classList.remove('open');
  renderProfile(p);
});

document.addEventListener('click', e => {
  if (!e.target.closest('.profile-picker')) profileSugg.classList.remove('open');
});

function renderProfile(p) {
  const initials = p.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const isBowler = p.role === 'Bowler';
  const maxScore = Math.max(...p.recentScores);

  const statsBoxes = isBowler ? `
    <div class="profile-stat-box"><div class="psb-label">Wickets</div><div class="psb-val">${p.wkts}</div><div class="psb-sub">Career total</div></div>
    <div class="profile-stat-box"><div class="psb-label">Avg</div><div class="psb-val">${p.bavg}</div><div class="psb-sub">Bowling avg</div></div>
    <div class="profile-stat-box"><div class="psb-label">Economy</div><div class="psb-val">${p.econ}</div><div class="psb-sub">Runs per over</div></div>
    <div class="profile-stat-box"><div class="psb-label">5-Wickets</div><div class="psb-val">${MOCK.players.find(x => x.name === p.name)?.rank || 0}</div><div class="psb-sub">Fifers</div></div>
    <div class="profile-stat-box"><div class="psb-label">Tests</div><div class="psb-val">${p.tests}</div><div class="psb-sub">Matches</div></div>
    <div class="profile-stat-box"><div class="psb-label">ODIs</div><div class="psb-val">${p.odis}</div><div class="psb-sub">Matches</div></div>
  ` : `
    <div class="profile-stat-box"><div class="psb-label">Runs</div><div class="psb-val">${p.runs.toLocaleString()}</div><div class="psb-sub">Career total</div></div>
    <div class="profile-stat-box"><div class="psb-label">Average</div><div class="psb-val">${p.avg}</div><div class="psb-sub">Batting avg</div></div>
    <div class="profile-stat-box"><div class="psb-label">Strike Rate</div><div class="psb-val">${p.sr}</div><div class="psb-sub">Runs per 100 balls</div></div>
    <div class="profile-stat-box"><div class="psb-label">High Score</div><div class="psb-val">${p.hs}</div><div class="psb-sub">Best innings</div></div>
    <div class="profile-stat-box"><div class="psb-label">Centuries</div><div class="psb-val">${p.hundreds}</div><div class="psb-sub">100s</div></div>
    <div class="profile-stat-box"><div class="psb-label">Tests</div><div class="psb-val">${p.tests}</div><div class="psb-sub">Matches</div></div>
  `;

  const formatRows = p.formats ? Object.entries(p.formats).map(([fmt, stats]) => `
    <div class="format-row">
      <span class="format-label">${fmt.toUpperCase()}</span>
      <span style="font-family:var(--font-mono);font-size:13px">${Object.values(stats).join(' / ')}</span>
    </div>`).join('') : '';

  const chartBars = p.recentScores.map(s => `
    <div class="mc-bar" style="height:${(s / maxScore * 100).toFixed(0)}%;background:${s === maxScore ? 'var(--accent)' : 'rgba(0,229,160,0.4)'}" title="${s}"></div>
  `).join('');

  profileCard.innerHTML = `
    <div class="profile-main">
      <div class="profile-hero">
        <div class="profile-avatar-big" style="background:${p.color}">${initials}</div>
        <div>
          <div class="profile-name">${p.name}</div>
          <div class="profile-country">${p.country} · ${p.role}</div>
          <div class="profile-badges">
            <span class="profile-badge specialist">${p.role}</span>
            <span class="profile-badge">Born ${p.dob}</span>
            <span class="profile-badge">Debut ${p.debut}</span>
          </div>
        </div>
      </div>
      <div class="profile-stats-grid">${statsBoxes}</div>
      <div class="profile-charts">
        <div class="profile-chart-box">
          <div class="pch-title">Recent Scores / Performances</div>
          <div class="mini-chart">${chartBars}</div>
        </div>
        <div class="profile-chart-box">
          <div class="pch-title">By Format</div>
          ${formatRows}
        </div>
      </div>
    </div>
  `;
}

// Default profile
renderProfile(MOCK.players[0]);

// ── ICC Rankings ───────────────────────────────────────────────────────────

let iccFormat = 'test', iccRole = 'batting';

function renderICC() {
  const data = MOCK.iccRankings[iccFormat]?.[iccRole] || [];
  const head = document.getElementById('iccHead');
  const body = document.getElementById('iccBody');

  const isTeam = iccRole === 'team';
  head.innerHTML = isTeam
    ? `<tr><th>#</th><th>Team</th><th>Rating</th><th>Change</th></tr>`
    : `<tr><th>#</th><th>Player</th><th>Country</th><th>Rating</th><th>Change</th></tr>`;

  body.innerHTML = data.map((r, i) => {
    const rowClass = i === 0 ? 'icc-rank-1' : i === 1 ? 'icc-rank-2' : i === 2 ? 'icc-rank-3' : '';
    const chg = r.change;
    const chgClass = chg.startsWith('+') ? 'change-up' : chg === '+0' || chg === '0' ? 'change-same' : 'change-down';
    const chgIcon = chg.startsWith('+') ? '▲' : chg === '+0' || chg === '0' ? '—' : '▼';
    const chgText = `<span class="${chgClass}">${chgIcon} ${chg.replace(/[+-]/, '')}</span>`;

    if (isTeam) return `
      <tr class="${rowClass}">
        <td><span class="rank-badge ${getRankClass(r.rank)}">${getRankEmoji(r.rank)}</span></td>
        <td><div class="player-cell"><span style="font-size:20px">${r.flag}</span><span style="font-weight:500">${r.name}</span></div></td>
        <td><div class="rating-bar"><span class="rating-num">${r.rating}</span><div class="mini-bar" style="width:80px"><div class="mini-bar-fill" style="width:${(r.rating / 300 * 100).toFixed(0)}%"></div></div></div></td>
        <td>${chgText}</td>
      </tr>`;

    return `
      <tr class="${rowClass}">
        <td><span class="rank-badge ${getRankClass(r.rank)}">${getRankEmoji(r.rank)}</span></td>
        <td><div style="font-weight:500">${r.name}</div></td>
        <td><div style="font-size:12px;color:var(--text3)">${r.country}</div></td>
        <td><div class="rating-bar"><span class="rating-num">${r.rating}</span><div class="mini-bar" style="width:80px"><div class="mini-bar-fill" style="width:${(r.rating / 1000 * 100).toFixed(0)}%"></div></div></div></td>
        <td>${chgText}</td>
      </tr>`;
  }).join('') || `<tr><td colspan="5" style="padding:30px;text-align:center;color:var(--text3)">No data available</td></tr>`;
}

document.querySelectorAll('.icc-tabs .stat-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.icc-tabs .stat-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    iccFormat = btn.dataset.format;
    renderICC();
  });
});
document.querySelectorAll('.icc-subtabs .filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.icc-subtabs .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    iccRole = btn.dataset.role;
    renderICC();
  });
});

// ── Tournament Bracket ─────────────────────────────────────────────────────

function renderBracket(name) {
  const data = MOCK.bracket[name] || MOCK.bracket['ICC World Cup 2025'];
  const wrap = document.getElementById('bracketWrap');

  const rounds = data.rounds.map(round => {
    const matches = round.matches.map(m => {
      const bm = m.status === 'live' ? 'bm-live' : '';
      const t1cls = m.winner === m.t1 ? 'winner' : m.winner && m.winner !== m.t1 ? 'loser' : m.t1 === 'TBD' ? 'tbd' : '';
      const t2cls = m.winner === m.t2 ? 'winner' : m.winner && m.winner !== m.t2 ? 'loser' : m.t2 === 'TBD' ? 'tbd' : '';
      return `
        <div class="bracket-match ${bm}">
          <div class="bracket-team ${t1cls}">
            <span class="bt-name">${m.f1} ${m.t1}</span>
            <span class="bt-score">${m.s1 || '—'}</span>
          </div>
          <div class="bracket-team ${t2cls}">
            <span class="bt-name">${m.f2} ${m.t2}</span>
            <span class="bt-score">${m.s2 || '—'}</span>
          </div>
        </div>`;
    }).join('');
    return `<div class="bracket-round"><div class="bracket-round-title">${round.name}</div>${matches}</div>`;
  }).join('');

  wrap.innerHTML = `<div class="bracket">${rounds}</div>`;
}

document.getElementById('bracketTournament').addEventListener('change', function () {
  renderBracket(this.value);
});

// ── Standings ─────────────────────────────────────────────────────────────

async function renderStandings() {
  const data = await fetchAPI('standings', 'standings');
  document.getElementById('standingsBody').innerHTML = data.map((t, i) => {
    const rowClass = i < 4 ? 'qual-row' : i >= 7 ? 'elim-row' : '';
    const nrrClass = t.nrr.startsWith('+') ? 'nrr-pos' : 'nrr-neg';
    return `
      <tr class="${rowClass}">
        <td><span class="rank-badge">${t.pos}</span></td>
        <td><div class="player-cell"><span style="font-size:18px">${t.flag}</span><span style="font-weight:500">${t.team}</span></div></td>
        <td>${t.p}</td><td style="color:var(--accent)">${t.w}</td><td style="color:var(--red)">${t.l}</td>
        <td>${t.nr}</td><td class="${nrrClass}">${t.nrr}</td><td class="pts-cell">${t.pts}</td>
      </tr>`;
  }).join('');
}

// ── Match History ──────────────────────────────────────────────────────────

async function renderHistory(filter = 'all') {
  const data = await fetchAPI('matches/history', 'matchHistory');
  const filtered = filter === 'all' ? data : data.filter(m => m.format === filter);
  document.getElementById('historyList').innerHTML = filtered.map(m => `
    <div class="history-card">
      <div>
        <div class="history-teams">${m.team1} <span style="color:var(--text3);font-size:13px">vs</span> ${m.team2}</div>
        <div class="history-meta"><span><i class="fas fa-location-dot"></i> ${m.venue}</span><span><i class="fas fa-calendar"></i> ${m.date}</span></div>
      </div>
      <div style="text-align:center">
        <div class="result-text">${m.result}</div>
        <span class="winner-tag win">${m.winner} ✓</span>
      </div>
      <div style="text-align:right">
        <div class="match-format-badge ${m.format}">${m.format.toUpperCase()}</div>
        <div style="margin-top:6px;font-family:var(--font-mono);font-size:12px;color:var(--text2)">${m.score1} / ${m.score2}</div>
      </div>
    </div>`).join('') || `<div style="padding:40px;text-align:center;color:var(--text3)">No matches found.</div>`;
}

document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderHistory(btn.dataset.filter);
  });
});

document.getElementById('tournamentSelect').addEventListener('change', renderStandings);

// ── Search ────────────────────────────────────────────────────────────────

document.getElementById('searchInput').addEventListener('input', function () {
  const q = this.value.toLowerCase().trim();
  ['.match-card', '.stat-table tbody tr', '.history-card'].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.display = !q || el.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
});

// ── Init ───────────────────────────────────────────────────────────────────


// ══════════════════════════════════════════════════════════════════════════
// LIVE SCORECARD MODAL
// ══════════════════════════════════════════════════════════════════════════

let modalRefreshTimer = null;
let currentModalMatchId = null;
let currentModalTab = 'batting';
let currentInnings = 0;
let currentScorecardData = null;

// ── Open modal ─────────────────────────────────────────────────────────────
function openScorecardModal(matchId, t1, t2, s1, o1, s2, o2, crr, venue, isLive) {
  currentModalMatchId = matchId;
  currentScorecardData = null;
  currentModalTab = 'batting';
  currentInnings = 0;

  // Show modal
  document.getElementById('scorecardModal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Set header immediately with known data
  setModalHeader(t1, t2, s1, o1, s2, o2, crr, venue, isLive);
  document.getElementById('modalTitle').textContent = `${t1} vs ${t2}`;

  // Set active tab
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.modal-tab[data-tab="batting"]').classList.add('active');

  // Load scorecard
  loadModalScorecard(matchId, isLive);

  // Auto-refresh for live matches every 30s
  clearInterval(modalRefreshTimer);
  if (isLive) {
    document.getElementById('modalAutoRefreshBadge').style.display = 'flex';
    modalRefreshTimer = setInterval(() => loadModalScorecard(matchId, true), 30000);
  } else {
    document.getElementById('modalAutoRefreshBadge').style.display = 'none';
  }
}

function setModalHeader(t1, t2, s1, o1, s2, o2, crr, venue, isLive) {
  document.getElementById('modalTeam1').innerHTML = `
    <div class="modal-team-name">${t1}</div>
    <div class="modal-team-score">${s1 !== 'TBD' ? s1 : '—'}</div>
    <div class="modal-team-overs">${o1 ? o1 + ' ov' : ''}</div>`;
  document.getElementById('modalTeam2').innerHTML = `
    <div class="modal-team-name">${t2}</div>
    <div class="modal-team-score">${s2 !== 'TBD' ? s2 : '—'}</div>
    <div class="modal-team-overs">${o2 ? o2 + ' ov' : ''}</div>`;
  document.getElementById('modalCRR').textContent = crr || '—';

  // Badge colour
  const badge = document.querySelector('.modal-live-badge');
  if (isLive) {
    badge.style.display = 'flex';
    document.getElementById('modalStatusText').textContent = venue || '';
  } else {
    badge.style.display = 'none';
    document.getElementById('modalStatusText').textContent = venue || '';
  }
}

// ── Fetch & render scorecard ────────────────────────────────────────────────
async function loadModalScorecard(matchId, isLive) {
  showModalLoading();
  try {
    const res = await fetch(`${API_BASE}/cricbuzz/scorecard/${matchId}`, {
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data) throw new Error(json.error || 'Empty scorecard response');

    currentScorecardData = json.data;

    // ── Debug: log full structure to console so we can see what keys exist ──
    const _sc = json.data.scoreCard || json.data.scorecard || [];
    console.group('[CricPulse] Scorecard API response');
    console.log('Top-level keys:', Object.keys(json.data));
    console.log('scoreCard length:', _sc.length);
    if (_sc[0]) {
      console.log('Inn[0] keys:', Object.keys(_sc[0]));
      console.log('batTeamDetails keys:', _sc[0].batTeamDetails ? Object.keys(_sc[0].batTeamDetails) : 'MISSING');
      console.log('batsmenData sample:', JSON.stringify(_sc[0].batTeamDetails?.batsmenData)?.slice(0, 300));
    }
    console.groupEnd();

    // ── Update modal header with live scores from API ──────────────────────
    const inningsList = json.data.matchScoreDetails?.inningsScoreList || [];
    if (inningsList.length >= 1) {
      const i1 = inningsList[0] || {};
      const i2 = inningsList[1] || {};

      // Build score strings safely
      const fmt = (inn) => inn.score != null
        ? `${inn.score}/${inn.wickets ?? inn.wkts ?? 0}`
        : (inn.batTeamName ? 'Yet to bat' : '—');

      const crr = json.data.matchScoreDetails?.currentRunRate
        ? `CRR: ${parseFloat(json.data.matchScoreDetails.currentRunRate).toFixed(2)}`
        : '';
      const hdr = json.data.matchHeader || {};
      const venue = hdr.venue?.name
        ? `${hdr.venue.name}${hdr.venue.city ? ', ' + hdr.venue.city : ''}`
        : '';

      setModalHeader(
        i1.batTeamName || '', i2.batTeamName || '',
        fmt(i1), String(i1.overs || ''),
        fmt(i2), String(i2.overs || ''),
        crr, venue, isLive
      );
    }

    renderModalTab(currentModalTab);
  } catch (e) {
    console.error('Scorecard fetch failed:', e.message);
    document.getElementById('modalBody').innerHTML = `
      <div class="modal-error">
        <i class="fas fa-triangle-exclamation"></i>
        <div style="font-size:14px;color:var(--text2)">Could not load scorecard</div>
        <div style="font-size:12px;color:var(--text3);margin-top:4px">${e.message}</div>
        <button onclick="loadModalScorecard('${matchId}', ${isLive})"
          style="margin-top:14px;padding:8px 20px;background:var(--accent);color:#000;
          border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px">
          <i class="fas fa-rotate-right"></i> Retry
        </button>
      </div>`;
  }
}

function showModalLoading() {
  document.getElementById('modalBody').innerHTML = `
    <div class="modal-loading">
      <i class="fas fa-spinner"></i>
      <span>Loading scorecard...</span>
    </div>`;
}

function showModalError(msg) {
  document.getElementById('modalBody').innerHTML = `
    <div class="modal-error">
      <i class="fas fa-triangle-exclamation"></i>
      <div style="font-size:14px;color:var(--text2)">${msg}</div>
      <div style="font-size:12px;color:var(--text3);margin-top:4px">Live data from Cricbuzz API</div>
    </div>`;
}

// ── Render a tab ────────────────────────────────────────────────────────────
function renderModalTab(tab) {
  currentModalTab = tab;
  document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.modal-tab[data-tab="${tab}"]`)?.classList.add('active');

  if (!currentScorecardData) { showModalLoading(); return; }

  const sc = currentScorecardData;
  const body = document.getElementById('modalBody');

  if (tab === 'info') { renderModalInfo(sc, body); return; }

  // Cricbuzz API uses 'scoreCard' (capital C) — support both casings
  const scorecard = sc.scoreCard || sc.scorecard || [];

  if (!scorecard.length) {
    // No full scorecard yet — show score totals from matchScoreDetails if available
    const inningsList = sc.matchScoreDetails?.inningsScoreList || [];
    if (inningsList.length) {
      body.innerHTML = `
        <div style="padding:10px 0">
          ${inningsList.map((inn, i) => `
            <div style="display:flex;justify-content:space-between;align-items:center;
              padding:16px 20px;background:var(--bg3);border-radius:12px;margin-bottom:10px">
              <div style="font-family:var(--font-display);font-size:20px;letter-spacing:1px">
                ${inn.batTeamName || 'Team ' + (i + 1)}
              </div>
              <div style="font-family:var(--font-mono);font-size:22px;color:var(--accent);font-weight:700">
                ${inn.score ?? 0}/${inn.wickets ?? inn.wkts ?? 0}
                <span style="font-size:13px;color:var(--text3)"> (${inn.overs ?? 0} ov)</span>
              </div>
            </div>`).join('')}
          <div style="margin-top:12px;text-align:center;font-size:12px;color:var(--text3)">
            <i class="fas fa-circle-info"></i> Full batting/bowling card loading...
          </div>
        </div>`;
    } else {
      body.innerHTML = `<div class="modal-error">
        <i class="fas fa-clock"></i>
        <div>Scorecard not yet available for this match</div>
      </div>`;
    }
    return;
  }

  // Clamp currentInnings index
  if (currentInnings >= scorecard.length) currentInnings = 0;

  // Build innings toggle buttons
  const inningsTabs = scorecard.map((inn, i) => {
    const label = inn.batTeamDetails?.batTeamShortName
      || inn.batteamsname
      || inn.batTeamDetails?.batTeamName?.slice(0, 3).toUpperCase()
      || ('Inn ' + (i + 1));
    return `<button class="innings-btn ${i === currentInnings ? 'active' : ''}"
      onclick="selectInnings(${i})">${label} ${i + 1}</button>`;
  }).join('');

  const inn = scorecard[currentInnings];
  if (!inn) {
    body.innerHTML = '<div class="modal-error"><i class="fas fa-clock"></i><div>No innings data</div></div>';
    return;
  }

  if (tab === 'batting') renderBattingTab(inn, inningsTabs, body);
  else if (tab === 'bowling') renderBowlingTab(inn, inningsTabs, body);
  else if (tab === 'bbb') renderBBBTab(sc, inningsTabs, body);
  else if (tab === 'fow') renderFOWTab(inn, inningsTabs, body);
  else if (tab === 'debug') { renderDebugTab(sc, inn, body); return; } // async — fires independently
}

function selectInnings(idx) {
  currentInnings = idx;
  renderModalTab(currentModalTab);
}

// ── Batting tab ─────────────────────────────────────────────────────────────
function renderBattingTab(inn, inningsTabs, body) {
  // batsmenData may be object {"0":{...}} or array — server normalises, but handle both
  const batsmenRaw = inn.batTeamDetails?.batsmenData || {};
  const batters = Array.isArray(batsmenRaw)
    ? batsmenRaw
    : Object.values(batsmenRaw);

  const total = inn.scoreDetails;
  const teamName = inn.batTeamDetails?.batTeamShortName
    || inn.batTeamDetails?.batTeamName || 'BAT';

  const rows = batters.length
    ? batters.map(b => {
      // Map all Cricbuzz field name variants across API versions
      const runs = b.runs ?? 0;
      const balls = b.balls ?? 0;
      const fours = b.fours ?? 0;
      const sixes = b.sixes ?? 0;
      const name = b.batName || b.name || b.batFullName || '—';
      const outDesc = b.outDesc || b.dismissal || b.howOut || '';
      // Server sets outDesc='' for not-out and isBatting=true for current batsmen
      const isOut = outDesc.trim().length > 0;
      const isBatting = b.isBatting === true || (!isOut && runs > 0);
      const cls = isBatting ? 'batting-current' : isOut ? 'out-row' : '';
      const sr = b.strikeRate ?? b.strkRate ?? b.strkrate ?? b.sr
        ?? (balls > 0 ? ((runs / balls) * 100).toFixed(1) : '0.00');
      return `<tr class="${cls}">
          <td>
            <div style="font-weight:500">${name}
              ${isBatting ? '<span style="color:var(--accent);font-size:10px;margin-left:6px">★ batting</span>' : ''}
            </div>
            <div style="font-size:11px;color:var(--text3)">${isOut ? outDesc : 'not out'}</div>
          </td>
          <td class="highlight">${runs}</td>
          <td>${balls}</td>
          <td>${fours}</td>
          <td>${sixes}</td>
          <td>${sr}</td>
        </tr>`;
    }).join('')
    : `<tr><td colspan="6" style="padding:24px;text-align:center;color:var(--text3)">
        <i class="fas fa-clock"></i> No batting data yet for this innings
      </td></tr>`;

  const extras = inn.extrasData;
  const extrasStr = extras
    ? `B ${extras.byes || 0}, LB ${extras.legByes || 0}, WD ${extras.wides || 0}, NB ${extras.noBalls || 0} = ${extras.extras || 0}`
    : '—';

  body.innerHTML = `
    <div class="innings-toggle">${inningsTabs}</div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div style="font-family:var(--font-display);font-size:20px;letter-spacing:2px">${teamName} Innings</div>
      ${total ? `<div style="font-family:var(--font-mono);font-size:15px;color:var(--accent)">
        ${total.runs || 0}/${total.wickets ?? total.wkts ?? 0}
        <span style="font-size:12px;color:var(--text3)"> (${total.overs || 0} ov)</span>
      </div>` : ''}
    </div>
    <div class="table-wrap">
      <table class="stat-table">
        <thead><tr><th>Batter</th><th>R</th><th>B</th><th>4s</th><th>6s</th><th>SR</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div style="margin-top:14px;padding:12px 16px;background:var(--bg3);border-radius:8px;
      font-size:12px;color:var(--text2);font-family:var(--font-mono)">
      EXTRAS: ${extrasStr}
    </div>`;
}

// ── Bowling tab ─────────────────────────────────────────────────────────────
function renderBowlingTab(inn, inningsTabs, body) {
  const bowlersRaw = inn.bowlTeamDetails?.bowlersData || {};
  const bowlers = Array.isArray(bowlersRaw)
    ? bowlersRaw
    : Object.values(bowlersRaw);
  const teamName = inn.bowlTeamDetails?.bowlTeamShortName
    || inn.bowlTeamDetails?.bowlTeamName || 'BOWL';

  const rows = bowlers.length
    ? bowlers.map(b => {
      // Map all Cricbuzz field name variants across API versions
      const name = b.bowlName || b.name || b.bowlFullName || '—';
      const overs = b.overs ?? b.ov ?? '—';
      const maidens = b.maidens ?? b.maiden ?? b.md ?? 0;
      const runs = b.runs ?? b.r ?? '—';
      const wickets = b.wickets ?? b.wkts ?? b.wkt ?? 0;
      const economy = b.economy ?? b.econ ?? b.eco ?? '—';
      const wides = b.wides ?? b.wd ?? 0;
      const noBalls = b.noBalls ?? b.nb ?? 0;
      return `<tr>
          <td style="font-weight:500">${name}</td>
          <td>${overs}</td>
          <td>${maidens}</td>
          <td>${runs}</td>
          <td class="highlight">${wickets}</td>
          <td>${economy}</td>
          <td>${wides} / ${noBalls}</td>
        </tr>`;
    }).join('')
    : `<tr><td colspan="7" style="padding:24px;text-align:center;color:var(--text3)">
        <i class="fas fa-clock"></i> No bowling data yet
      </td></tr>`;

  body.innerHTML = `
    <div class="innings-toggle">${inningsTabs}</div>
    <div style="font-family:var(--font-display);font-size:20px;letter-spacing:2px;margin-bottom:14px">
      ${teamName} Bowling
    </div>
    <div class="table-wrap">
      <table class="stat-table">
        <thead><tr><th>Bowler</th><th>O</th><th>M</th><th>R</th><th>W</th><th>Econ</th><th>WD/NB</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ── Ball by ball tab ────────────────────────────────────────────────────────
function renderBBBTab(sc, inningsTabs, body) {
  const bbb = sc.matchScoreDetails?.inningsScoreList || [];
  if (!bbb.length) {
    body.innerHTML = `<div class="innings-toggle">${inningsTabs}</div><div class="modal-error"><i class="fas fa-clock"></i><div>Ball-by-ball data not available yet</div></div>`;
    return;
  }

  // Use recentOvsNumList if available (last few overs summary)
  const scorecard = sc.scoreCard || sc.scorecard || [];
  const inn = scorecard[currentInnings];
  const ovSummary = inn?.overSummaryList || [];

  let bbbHtml = '';
  if (ovSummary.length) {
    bbbHtml = ovSummary.slice(-10).reverse().map(ov => {
      const balls = (ov.score || '').split(',').map(b => b.trim()).filter(Boolean);
      const ballsHtml = balls.map(b => {
        let cls = 'run';
        if (b === 'W') cls = 'wicket';
        else if (b === '6') cls = 'six';
        else if (b === '4') cls = 'four';
        else if (b === '0' || b === '.') cls = 'dot';
        else if (b.includes('wd') || b.includes('WD')) cls = 'wide';
        else if (b.includes('nb') || b.includes('NB')) cls = 'nb';
        return `<div class="ball ${cls}">${b}</div>`;
      }).join('');
      return `<div class="modal-over-row">
        <span class="modal-over-label">Ov ${ov.ovNum || '?'}</span>
        ${ballsHtml}
        <span style="font-family:var(--font-mono);font-size:11px;color:var(--accent);margin-left:8px">${ov.totalRuns ?? ''}</span>
      </div>`;
    }).join('');
  } else {
    bbbHtml = `<div style="color:var(--text3);font-size:13px;padding:20px 0">Detailed ball-by-ball not available from API for this match.</div>`;
  }

  body.innerHTML = `
    <div class="innings-toggle">${inningsTabs}</div>
    <div style="font-family:var(--font-display);font-size:20px;letter-spacing:2px;margin-bottom:14px">Ball by Ball <span style="font-size:12px;color:var(--text3)">(last 10 overs)</span></div>
    <div class="modal-bbb">${bbbHtml}</div>`;
}

// ── Fall of wickets tab ─────────────────────────────────────────────────────
function renderFOWTab(inn, inningsTabs, body) {
  // wicketsData is normalised to array by server; handle both just in case
  const fowRaw = inn.wicketsData || {};
  const fow = Array.isArray(fowRaw) ? fowRaw : Object.values(fowRaw);

  const chips = fow.map((w, i) => `
    <div class="fow-chip">
      <div class="fow-score">${w.wktRuns ?? '—'}/${i + 1}</div>
      <div class="fow-name">${w.batName || w.batsmanname || '—'}</div>
      <div class="fow-over">Ov ${w.wktOver ?? '?'}</div>
    </div>`).join('') || `<div style="color:var(--text3);padding:20px 0">No wickets fallen yet</div>`;

  body.innerHTML = `
    <div class="innings-toggle">${inningsTabs}</div>
    <div style="font-family:var(--font-display);font-size:20px;letter-spacing:2px;margin-bottom:16px">Fall of Wickets</div>
    <div class="modal-fow">${chips}</div>`;
}

// ── Match info tab ──────────────────────────────────────────────────────────
function renderModalInfo(sc, body) {
  const info = sc.matchHeader || {};
  const venue = info.venue || {};
  const toss = info.tossResults || {};

  const items = [
    { label: 'Match Type', val: info.matchFormat || info.matchType || '—' },
    { label: 'Venue', val: venue.name ? `${venue.name}, ${venue.city || ''}` : '—' },
    { label: 'Toss', val: toss.tossWinnerName ? `${toss.tossWinnerName} won, chose to ${toss.decision}` : '—' },
    { label: 'Status', val: info.status || '—' },
    { label: 'Series', val: info.seriesName || '—' },
    { label: 'Match No.', val: info.matchDescription || '—' },
    { label: 'Umpire 1', val: info.umpire1?.name || '—' },
    { label: 'Umpire 2', val: info.umpire2?.name || '—' },
    { label: 'Third Umpire', val: info.umpire3?.name || '—' },
    { label: 'Match Referee', val: info.referee?.name || '—' },
  ];

  body.innerHTML = `
    <div style="font-family:var(--font-display);font-size:20px;letter-spacing:2px;margin-bottom:16px">Match Information</div>
    <div class="match-info-grid">
      ${items.map(it => `
        <div class="info-chip">
          <div class="info-label">${it.label}</div>
          <div class="info-val">${it.val}</div>
        </div>`).join('')}
    </div>`;
}

// ── Modal tab clicks ────────────────────────────────────────────────────────
document.querySelectorAll('.modal-tab').forEach(btn => {
  btn.addEventListener('click', () => renderModalTab(btn.dataset.tab));
});

// ── Close modal ─────────────────────────────────────────────────────────────
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('scorecardModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function closeModal() {
  document.getElementById('scorecardModal').classList.add('hidden');
  document.body.style.overflow = '';
  clearInterval(modalRefreshTimer);
  currentModalMatchId = null;
}

// ── Debug tab — shows raw API structure ─────────────────────────────────────
async function renderDebugTab(sc, inn, body) {
  body.innerHTML = `
    <div style="font-family:var(--font-mono);font-size:12px;color:var(--text2);padding:4px 0">
      <div style="font-family:var(--font-display);font-size:18px;letter-spacing:2px;margin-bottom:14px;color:var(--accent)">
        🔍 Raw hscard Response — matchId: ${currentModalMatchId}
      </div>
      <div id="debugResults">
        <div style="color:var(--text3)"><i class="fas fa-spinner fa-spin"></i> Fetching raw API response...</div>
      </div>
    </div>`;

  if (!currentModalMatchId) {
    document.getElementById('debugResults').innerHTML = '<div style="color:#f87171">No matchId</div>';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/cricbuzz/debug/${currentModalMatchId}`);
    const json = await res.json();
    const raw = json.raw || json;

    // Walk the raw object and show every key/value up to 2 levels deep
    const topKeys = Object.keys(raw);

    const sections = topKeys.map(k => {
      const val = raw[k];
      const preview = typeof val === 'object' && val !== null
        ? (Array.isArray(val)
          ? `Array[${val.length}] → first item keys: ${val[0] ? Object.keys(val[0]).join(', ') : 'empty'}`
          : `Object keys: ${Object.keys(val).join(', ')}`)
        : String(val);

      // For arrays/objects, also show a JSON snippet
      let snippet = '';
      if (Array.isArray(val) && val[0]) {
        snippet = `<pre style="color:#fbbf24;white-space:pre-wrap;font-size:10px;margin:6px 0 0;background:rgba(0,0,0,0.3);padding:6px;border-radius:4px;max-height:200px;overflow:auto">${JSON.stringify(val[0], null, 2).slice(0, 800)}</pre>`;
      } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        snippet = `<pre style="color:#a78bfa;white-space:pre-wrap;font-size:10px;margin:6px 0 0;background:rgba(0,0,0,0.3);padding:6px;border-radius:4px;max-height:200px;overflow:auto">${JSON.stringify(val, null, 2).slice(0, 800)}</pre>`;
      }

      return `<div style="background:var(--bg3);border-radius:8px;padding:12px;margin-bottom:8px">
        <div style="color:#4ade80;font-weight:600;margin-bottom:4px">"${k}"</div>
        <div style="color:var(--text2)">${preview}</div>
        ${snippet}
      </div>`;
    }).join('');

    document.getElementById('debugResults').innerHTML = sections;
  } catch (e) {
    document.getElementById('debugResults').innerHTML =
      `<div style="color:#f87171">Fetch failed: ${e.message}</div>`;
  }
}


async function initAll() {
  await renderMatches();
  renderScorecard(0);
  renderPlayerStats('batting');
  renderICC();
  renderBracket('ICC World Cup 2025');
  await renderStandings();
  await renderHistory('all');
}

initAll();
setInterval(() => {
  if (document.getElementById('section-live').classList.contains('active')) renderMatches();
}, 30000);