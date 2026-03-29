// ============================================
// CricPulse — server.test.js
// Full Jest + Supertest suite for all routes
// Run: npm test
// ============================================

const request = require('supertest');
const mongoose = require('mongoose');

// ── In-memory MongoDB (no real DB needed) ──────────────────────────────────
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  // require AFTER setting env so mongoose uses in-memory URI
  app = require('../server');
  // Give mongoose a moment to connect
  await new Promise(r => setTimeout(r, 500));
}, 20000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// ── Helpers ───────────────────────────────────────────────────────────────

const sampleMatch = {
  type: 'T20 International',
  format: 't20',
  status: 'live',
  venue: 'Wankhede Stadium, Mumbai',
  team1: { name: 'IND', flag: '🇮🇳', score: '187/4', overs: '18.3' },
  team2: { name: 'AUS', flag: '🇦🇺', score: '142/3', overs: '16.0' },
  crr: 'CRR: 8.87',
};

const samplePlayer = {
  name: 'Virat Kohli',
  country: 'India',
  role: 'Batsman',
  color: '#e11d48',
  batting: { runs: 14873, avg: 57.32, sr: 93.4, hs: 183, hundreds: 50, fifties: 65 },
  bowling: { wkts: 4, avg: 92.0, econ: 5.1, sr: 108, five: 0 },
  recentScores: [78, 0, 44, 183],
};

const sampleStanding = {
  tournament: 'ICC World Cup 2025',
  team: 'India',
  flag: '🇮🇳',
  pos: 1, p: 9, w: 7, l: 1, nr: 1, nrr: '+1.432', pts: 15,
};

const sampleICCRanking = {
  format: 'test',
  role: 'batting',
  rank: 1,
  name: 'Steve Smith',
  country: 'Australia',
  rating: 904,
  change: '+0',
};

const sampleBracket = {
  tournament: 'Test Cup 2025',
  rounds: [{
    name: 'Final',
    matches: [{ t1: 'IND', f1: '🇮🇳', s1: '', t2: 'AUS', f2: '🇦🇺', s2: '', winner: '', status: 'upcoming' }],
  }],
};

// ═══════════════════════════════════════════════════════════════════════════
// 1. HEALTH
// ═══════════════════════════════════════════════════════════════════════════

describe('GET /api/health', () => {
  test('returns ok + db connected', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('connected');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 2. MATCHES — CRUD
// ═══════════════════════════════════════════════════════════════════════════

describe('Matches API', () => {
  let matchId;

  // CREATE
  test('POST /api/matches — creates a match', async () => {
    const res = await request(app).post('/api/matches').send(sampleMatch);
    expect(res.statusCode).toBe(201);
    expect(res.body.team1.name).toBe('IND');
    expect(res.body.format).toBe('t20');
    matchId = res.body._id;
  });

  test('POST /api/matches — fails with invalid format', async () => {
    const res = await request(app).post('/api/matches').send({ ...sampleMatch, format: 'invalid' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test('POST /api/matches — fails without required type field', async () => {
    const { type, ...noType } = sampleMatch;
    const res = await request(app).post('/api/matches').send(noType);
    expect(res.statusCode).toBe(400);
  });

  // READ — Live
  test('GET /api/matches/live — returns live/upcoming matches', async () => {
    const res = await request(app).get('/api/matches/live');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach(m => expect(['live', 'upcoming']).toContain(m.status));
  });

  // READ — History
  test('GET /api/matches/history — returns completed matches', async () => {
    // seed a completed match first
    await request(app).post('/api/matches').send({
      ...sampleMatch, status: 'completed', result: 'IND won by 24 runs', winner: 'IND',
    });
    const res = await request(app).get('/api/matches/history');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(m => expect(m.status).toBe('completed'));
  });

  test('GET /api/matches/history — filters by format', async () => {
    await request(app).post('/api/matches').send({ ...sampleMatch, format: 'odi', status: 'completed' });
    const res = await request(app).get('/api/matches/history?format=odi');
    expect(res.statusCode).toBe(200);
    res.body.forEach(m => expect(m.format).toBe('odi'));
  });

  // READ — By ID
  test('GET /api/matches/:id — returns a single match', async () => {
    const res = await request(app).get(`/api/matches/${matchId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(matchId);
  });

  test('GET /api/matches/:id — 404 for unknown id', async () => {
    const res = await request(app).get('/api/matches/000000000000000000000000');
    expect(res.statusCode).toBe(404);
  });

  // READ — Scorecard
  test('GET /api/matches/:id/scorecard — returns scorecard fields', async () => {
    const res = await request(app).get(`/api/matches/${matchId}/scorecard`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('team1');
    expect(res.body).toHaveProperty('team2');
  });

  // UPDATE
  test('PATCH /api/matches/:id — updates match status', async () => {
    const res = await request(app)
      .patch(`/api/matches/${matchId}`)
      .send({ status: 'completed', result: 'IND won', winner: 'IND' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('completed');
    expect(res.body.result).toBe('IND won');
  });

  test('PATCH /api/matches/:id — 404 for unknown id', async () => {
    const res = await request(app).patch('/api/matches/000000000000000000000000').send({ status: 'live' });
    expect(res.statusCode).toBe(404);
  });

  // UPDATE — Score (convenience)
  test('PATCH /api/matches/:id/score — updates live score', async () => {
    // reset to live first
    const liveRes = await request(app).post('/api/matches').send(sampleMatch);
    const liveId = liveRes.body._id;
    const res = await request(app)
      .patch(`/api/matches/${liveId}/score`)
      .send({ team: 1, score: '200/4', overs: '20.0', crr: 'CRR: 10.0' });
    expect(res.statusCode).toBe(200);
    expect(res.body.team1.score).toBe('200/4');
  });

  // DELETE
  test('DELETE /api/matches/:id — deletes a match', async () => {
    const create = await request(app).post('/api/matches').send(sampleMatch);
    const id = create.body._id;
    const del = await request(app).delete(`/api/matches/${id}`);
    expect(del.statusCode).toBe(200);
    expect(del.body.message).toBe('Match deleted');

    // Confirm gone
    const find = await request(app).get(`/api/matches/${id}`);
    expect(find.statusCode).toBe(404);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 3. PLAYERS — CRUD
// ═══════════════════════════════════════════════════════════════════════════

describe('Players API', () => {
  let playerId;

  // CREATE
  test('POST /api/players — creates a player', async () => {
    const res = await request(app).post('/api/players').send(samplePlayer);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Virat Kohli');
    playerId = res.body._id;
  });

  test('POST /api/players — fails without name', async () => {
    const { name, ...noName } = samplePlayer;
    const res = await request(app).post('/api/players').send(noName);
    expect(res.statusCode).toBe(400);
  });

  // READ — List
  test('GET /api/players — returns batting-sorted list', async () => {
    const res = await request(app).get('/api/players?type=batting');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('rank');
  });

  test('GET /api/players — returns bowling-sorted list', async () => {
    await request(app).post('/api/players').send({
      ...samplePlayer, name: 'Jasprit Bumrah',
      bowling: { wkts: 350, avg: 20.14, econ: 4.32, sr: 27.9, five: 10 },
    });
    const res = await request(app).get('/api/players?type=bowling');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].bowling.wkts).toBeGreaterThanOrEqual(res.body[1]?.bowling?.wkts || 0);
  });

  // READ — Search
  test('GET /api/players/search — finds player by name', async () => {
    const res = await request(app).get('/api/players/search?q=virat');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].name.toLowerCase()).toContain('virat');
  });

  test('GET /api/players/search — returns empty for unknown name', async () => {
    const res = await request(app).get('/api/players/search?q=xyzunknown123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  // READ — By ID
  test('GET /api/players/:id — returns single player', async () => {
    const res = await request(app).get(`/api/players/${playerId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.country).toBe('India');
  });

  test('GET /api/players/:id — 404 for unknown id', async () => {
    const res = await request(app).get('/api/players/000000000000000000000000');
    expect(res.statusCode).toBe(404);
  });

  // UPDATE
  test('PUT /api/players/:id — updates player data', async () => {
    const res = await request(app)
      .put(`/api/players/${playerId}`)
      .send({ ...samplePlayer, batting: { ...samplePlayer.batting, runs: 15000 } });
    expect(res.statusCode).toBe(200);
    expect(res.body.batting.runs).toBe(15000);
  });

  test('PUT /api/players/:id — 404 for unknown id', async () => {
    const res = await request(app).put('/api/players/000000000000000000000000').send(samplePlayer);
    expect(res.statusCode).toBe(404);
  });

  // DELETE
  test('DELETE /api/players/:id — deletes a player', async () => {
    const create = await request(app).post('/api/players').send({ ...samplePlayer, name: 'Temp Player' });
    const id = create.body._id;
    const del = await request(app).delete(`/api/players/${id}`);
    expect(del.statusCode).toBe(200);
    expect(del.body.message).toBe('Player deleted');

    const find = await request(app).get(`/api/players/${id}`);
    expect(find.statusCode).toBe(404);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 4. STANDINGS
// ═══════════════════════════════════════════════════════════════════════════

describe('Standings API', () => {
  let standingId;

  test('POST /api/standings — creates a standing entry', async () => {
    const res = await request(app).post('/api/standings').send(sampleStanding);
    expect(res.statusCode).toBe(201);
    expect(res.body.team).toBe('India');
    standingId = res.body._id;
  });

  test('GET /api/standings — returns standings for tournament', async () => {
    const res = await request(app).get('/api/standings?tournament=ICC World Cup 2025');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].tournament).toBe('ICC World Cup 2025');
  });

  test('GET /api/standings — returns empty array for unknown tournament', async () => {
    const res = await request(app).get('/api/standings?tournament=Fake Cup');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  test('PATCH /api/standings/:id — updates points', async () => {
    const res = await request(app).patch(`/api/standings/${standingId}`).send({ pts: 17 });
    expect(res.statusCode).toBe(200);
    expect(res.body.pts).toBe(17);
  });

  test('PATCH /api/standings/:id — 404 for unknown id', async () => {
    const res = await request(app).patch('/api/standings/000000000000000000000000').send({ pts: 10 });
    expect(res.statusCode).toBe(404);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 5. ICC RANKINGS
// ═══════════════════════════════════════════════════════════════════════════

describe('ICC Rankings API', () => {
  test('POST /api/icc — creates a ranking entry', async () => {
    const res = await request(app).post('/api/icc').send(sampleICCRanking);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Steve Smith');
    expect(res.body.format).toBe('test');
  });

  test('GET /api/icc — returns rankings filtered by format & role', async () => {
    const res = await request(app).get('/api/icc?format=test&role=batting');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(r => {
      expect(r.format).toBe('test');
      expect(r.role).toBe('batting');
    });
  });

  test('GET /api/icc — returns empty for non-existent format/role combo', async () => {
    const res = await request(app).get('/api/icc?format=t20&role=allrounder');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(0);
  });

  test('PUT /api/icc — bulk replaces rankings for format+role', async () => {
    const res = await request(app).put('/api/icc').send({
      format: 'odi',
      role: 'batting',
      rankings: [
        { name: 'Virat Kohli', country: 'India', rating: 871, change: '+1' },
        { name: 'Babar Azam',  country: 'Pakistan', rating: 858, change: '-1' },
      ],
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('2 ICC rankings');

    // Verify via GET
    const get = await request(app).get('/api/icc?format=odi&role=batting');
    expect(get.body).toHaveLength(2);
    expect(get.body[0].rank).toBe(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 6. TOURNAMENT BRACKET
// ═══════════════════════════════════════════════════════════════════════════

describe('Bracket API', () => {
  let bracketId;

  test('POST /api/bracket — creates a bracket', async () => {
    const res = await request(app).post('/api/bracket').send(sampleBracket);
    expect(res.statusCode).toBe(201);
    expect(res.body.tournament).toBe('Test Cup 2025');
    expect(res.body.rounds).toHaveLength(1);
    bracketId = res.body._id;
  });

  test('GET /api/bracket — returns bracket by tournament name', async () => {
    const res = await request(app).get('/api/bracket?tournament=Test Cup 2025');
    expect(res.statusCode).toBe(200);
    expect(res.body.tournament).toBe('Test Cup 2025');
  });

  test('GET /api/bracket — 404 for unknown tournament', async () => {
    const res = await request(app).get('/api/bracket?tournament=Unknown Cup');
    expect(res.statusCode).toBe(404);
  });

  test('PATCH /api/bracket/:id/match — updates a specific match in a round', async () => {
    const res = await request(app)
      .patch(`/api/bracket/${bracketId}/match`)
      .send({ roundIdx: 0, matchIdx: 0, update: { winner: 'IND', status: 'completed', s1: '204/4', s2: '198/8' } });
    expect(res.statusCode).toBe(200);
    expect(res.body.rounds[0].matches[0].winner).toBe('IND');
    expect(res.body.rounds[0].matches[0].status).toBe('completed');
  });

  test('PATCH /api/bracket/:id/match — 404 for unknown bracket id', async () => {
    const res = await request(app)
      .patch('/api/bracket/000000000000000000000000/match')
      .send({ roundIdx: 0, matchIdx: 0, update: {} });
    expect(res.statusCode).toBe(404);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// 7. 404 HANDLER
// ═══════════════════════════════════════════════════════════════════════════

describe('404 Handler', () => {
  test('Unknown route returns 404 with message', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});