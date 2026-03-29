// ===========================
// seed.js v2 — Full data seed
// Run: node seed.js
// ===========================

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cricpulse';

const MatchSchema = new mongoose.Schema({
  type:String, format:String, status:String, venue:String, date:Date,
  team1:{name:String,flag:String,score:String,overs:String},
  team2:{name:String,flag:String,score:String,overs:String},
  crr:String, result:String, winner:String,
  batting:[{team:String,players:[{name:String,runs:Number,balls:Number,fours:Number,sixes:Number,sr:Number,status:String,how:String}]}],
  bowling:[{team:String,players:[{name:String,overs:String,maiden:Number,runs:Number,wkts:Number,econ:Number}]}],
  ballByBall:[{over:Number,balls:[String]}],
  fow:[{score:String,name:String,over:String}],
},{ timestamps:true });

const PlayerSchema = new mongoose.Schema({
  name:String, country:String, color:String, role:String,
  dob:String, debut:String, tests:Number, odis:Number, t20s:Number,
  batting:{runs:Number,avg:Number,sr:Number,hs:Number,hundreds:Number,fifties:Number},
  bowling:{wkts:Number,avg:Number,econ:Number,sr:Number,five:Number},
  recentScores:[Number],
  formats:{test:{runs:Number,avg:Number},odi:{runs:Number,avg:Number},t20:{runs:Number,avg:Number}},
},{ timestamps:true });

const StandingSchema = new mongoose.Schema({ tournament:String,team:String,flag:String,pos:Number,p:Number,w:Number,l:Number,nr:Number,nrr:String,pts:Number });
const ICCRankingSchema = new mongoose.Schema({ format:String,role:String,rank:Number,name:String,country:String,flag:String,rating:Number,change:String });
const BracketSchema = new mongoose.Schema({ tournament:String, rounds:[{name:String,matches:[{t1:String,f1:String,s1:String,t2:String,f2:String,s2:String,winner:String,status:String}]}] },{ timestamps:true });

const Match      = mongoose.model('Match',      MatchSchema);
const Player     = mongoose.model('Player',     PlayerSchema);
const Standing   = mongoose.model('Standing',   StandingSchema);
const ICCRanking = mongoose.model('ICCRanking', ICCRankingSchema);
const Bracket    = mongoose.model('Bracket',    BracketSchema);

// ── Data ───────────────────────────────────────────────────────────────────

const matches = [
  {
    type:'T20 International', format:'t20', status:'live', venue:'Wankhede Stadium, Mumbai', date:new Date(),
    team1:{name:'IND',flag:'🇮🇳',score:'187/4',overs:'18.3'}, team2:{name:'AUS',flag:'🇦🇺',score:'142/3',overs:'16.0'}, crr:'CRR: 8.87',
    batting:[{team:'IND',players:[
      {name:'Rohit Sharma',runs:62,balls:38,fours:6,sixes:3,sr:163.2,status:'out',how:'c Maxwell b Starc'},
      {name:'Virat Kohli', runs:78,balls:52,fours:7,sixes:2,sr:150.0,status:'batting',how:'not out'},
      {name:'Suryakumar',  runs:31,balls:16,fours:2,sixes:3,sr:193.8,status:'batting',how:'not out'},
    ]}],
    bowling:[{team:'AUS',players:[
      {name:'Pat Cummins',overs:'4.0',maiden:0,runs:38,wkts:2,econ:9.5},
      {name:'Mitchell Starc',overs:'3.3',maiden:0,runs:42,wkts:1,econ:12.0},
    ]}],
    ballByBall:[
      {over:16,balls:['1','W','4','2','6','1']},
      {over:17,balls:['6','1','4','2','1','W']},
      {over:18,balls:['4','6','1','2','WD','1']},
    ],
    fow:[{score:'32/1',name:'Shubman Gill',over:'3.2'},{score:'89/2',name:'Rohit Sharma',over:'9.4'}],
  },
  { type:'ODI',status:'live',format:'odi',venue:"Lord's, London",date:new Date(),
    team1:{name:'ENG',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',score:'312/7',overs:'50.0'},team2:{name:'NZ',flag:'🇳🇿',score:'278/9',overs:'47.2'},crr:'CRR: 5.93' },
  { type:'T20 — IPL',status:'upcoming',format:'t20',venue:'Eden Gardens, Kolkata',date:new Date(Date.now()+2*3600000),
    team1:{name:'KKR',flag:'🟣',score:'TBD',overs:''},team2:{name:'MI',flag:'🔵',score:'TBD',overs:''},crr:'Starts in 2h 15m' },
  { type:'T20 International',format:'t20',status:'completed',venue:'Wankhede, Mumbai',date:new Date('2025-03-24'),
    team1:{name:'IND',flag:'🇮🇳',score:'204/4',overs:'20.0'},team2:{name:'AUS',flag:'🇦🇺',score:'180/7',overs:'20.0'},result:'India won by 24 runs',winner:'IND' },
  { type:'ODI',format:'odi',status:'completed',venue:"Lord's, London",date:new Date('2025-03-22'),
    team1:{name:'ENG',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',score:'278/9',overs:'50.0'},team2:{name:'PAK',flag:'🇵🇰',score:'281/7',overs:'49.3'},result:'England won by 3 wickets',winner:'ENG' },
  { type:'Test',format:'test',status:'completed',venue:'MCG, Melbourne',date:new Date('2025-03-18'),
    team1:{name:'AUS',flag:'🇦🇺',score:'540/8d',overs:'130.0'},team2:{name:'SA',flag:'🇿🇦',score:'210 & 302',overs:''},result:'Australia won by innings',winner:'AUS' },
];

const players = [
  { name:'Virat Kohli',   country:'India',       color:'#e11d48', role:'Batsman', dob:'Nov 5, 1988',  debut:'Aug 18, 2008', tests:113,odis:292,t20s:125,
    batting:{runs:14873,avg:57.32,sr:93.4,hs:183,hundreds:50,fifties:65}, bowling:{wkts:4,avg:92.0,econ:5.1,sr:108,five:0},
    recentScores:[122,0,44,183,76,31,89], formats:{test:{runs:9230,avg:49.95},odi:{runs:13906,avg:58.18},t20:{runs:4037,avg:52.43}} },
  { name:'Rohit Sharma',  country:'India',       color:'#2563eb', role:'Batsman', dob:'Apr 30, 1987', debut:'Jun 23, 2007', tests:62,odis:264,t20s:159,
    batting:{runs:10709,avg:48.61,sr:89.2,hs:264,hundreds:30,fifties:53}, bowling:{wkts:8,avg:42.0,econ:5.3,sr:47,five:0},
    recentScores:[56,83,14,176,23,119,62], formats:{test:{runs:3877,avg:40.6},odi:{runs:10709,avg:48.6},t20:{runs:4231,avg:32.1}} },
  { name:'Jasprit Bumrah',country:'India',       color:'#e11d48', role:'Bowler',  dob:'Dec 6, 1993',  debut:'Jan 23, 2016', tests:38,odis:86,t20s:72,
    batting:{runs:280,avg:6.2,sr:72.0,hs:35,hundreds:0,fifties:0}, bowling:{wkts:350,avg:20.14,econ:4.32,sr:27.9,five:10},
    recentScores:[2,0,4,1,35,1,0], formats:{test:{runs:100,avg:7.1},odi:{runs:120,avg:8.0},t20:{runs:60,avg:5.4}} },
  { name:'Steve Smith',   country:'Australia',   color:'#d97706', role:'Batsman', dob:'Jun 2, 1989',  debut:'Mar 1, 2010',  tests:106,odis:152,t20s:66,
    batting:{runs:9294,avg:61.80,sr:79.8,hs:239,hundreds:32,fifties:38}, bowling:{wkts:17,avg:60.1,econ:3.1,sr:116,five:0},
    recentScores:[101,36,239,18,55,88,131], formats:{test:{runs:9294,avg:61.8},odi:{runs:4162,avg:43.0},t20:{runs:1074,avg:22.4}} },
  { name:'Babar Azam',    country:'Pakistan',    color:'#0891b2', role:'Batsman', dob:'Oct 15, 1994', debut:'May 22, 2015', tests:57,odis:116,t20s:106,
    batting:{runs:9840,avg:56.12,sr:88.6,hs:158,hundreds:30,fifties:60}, bowling:{wkts:0,avg:0,econ:0,sr:0,five:0},
    recentScores:[77,158,44,102,22,61,88], formats:{test:{runs:3613,avg:45.7},odi:{runs:5488,avg:58.6},t20:{runs:4223,avg:44.4}} },
  { name:'Kagiso Rabada', country:'South Africa',color:'#059669', role:'Bowler',  dob:'May 25, 1995', debut:'Jan 7, 2015',  tests:56,odis:90,t20s:77,
    batting:{runs:620,avg:11.2,sr:88.0,hs:31,hundreds:0,fifties:0}, bowling:{wkts:312,avg:22.41,econ:4.98,sr:26.9,five:11},
    recentScores:[5,1,31,0,12,8,3], formats:{test:{runs:200,avg:9.0},odi:{runs:280,avg:11.0},t20:{runs:80,avg:8.0}} },
];

const standings = [
  {tournament:'ICC World Cup 2025',team:'India',      flag:'🇮🇳',pos:1, p:9,w:7,l:1,nr:1,nrr:'+1.432',pts:15},
  {tournament:'ICC World Cup 2025',team:'Australia',  flag:'🇦🇺',pos:2, p:9,w:6,l:2,nr:1,nrr:'+0.871',pts:13},
  {tournament:'ICC World Cup 2025',team:'England',    flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',pos:3, p:9,w:6,l:3,nr:0,nrr:'+0.541',pts:12},
  {tournament:'ICC World Cup 2025',team:'New Zealand',flag:'🇳🇿',pos:4, p:9,w:5,l:3,nr:1,nrr:'+0.218',pts:11},
  {tournament:'ICC World Cup 2025',team:'Pakistan',   flag:'🇵🇰',pos:5, p:9,w:5,l:4,nr:0,nrr:'-0.102',pts:10},
  {tournament:'ICC World Cup 2025',team:'South Africa',flag:'🇿🇦',pos:6,p:9,w:4,l:4,nr:1,nrr:'+0.091',pts:9},
  {tournament:'ICC World Cup 2025',team:'Sri Lanka',  flag:'🇱🇰',pos:7, p:9,w:3,l:5,nr:1,nrr:'-0.307',pts:7},
  {tournament:'ICC World Cup 2025',team:'West Indies',flag:'🏝️',pos:8, p:9,w:2,l:6,nr:1,nrr:'-0.812',pts:5},
];

const iccRankings = [
  // Test Batting
  {format:'test',role:'batting',rank:1,name:'Steve Smith',   country:'Australia',  rating:904,change:'+0'},
  {format:'test',role:'batting',rank:2,name:'Joe Root',      country:'England',    rating:891,change:'+1'},
  {format:'test',role:'batting',rank:3,name:'Virat Kohli',   country:'India',      rating:815,change:'+2'},
  {format:'test',role:'batting',rank:4,name:'Babar Azam',    country:'Pakistan',   rating:802,change:'-1'},
  {format:'test',role:'batting',rank:5,name:'Shubman Gill',  country:'India',      rating:762,change:'+1'},
  // Test Bowling
  {format:'test',role:'bowling',rank:1,name:'Jasprit Bumrah',country:'India',      rating:887,change:'+0'},
  {format:'test',role:'bowling',rank:2,name:'Pat Cummins',   country:'Australia',  rating:871,change:'+1'},
  {format:'test',role:'bowling',rank:3,name:'Kagiso Rabada', country:'South Africa',rating:843,change:'+0'},
  {format:'test',role:'bowling',rank:4,name:'R. Ashwin',     country:'India',      rating:798,change:'+0'},
  {format:'test',role:'bowling',rank:5,name:'Nathan Lyon',   country:'Australia',  rating:741,change:'-1'},
  // Test Teams
  {format:'test',role:'team',rank:1,name:'Australia',  flag:'🇦🇺',rating:124,change:'+0'},
  {format:'test',role:'team',rank:2,name:'India',      flag:'🇮🇳',rating:121,change:'+1'},
  {format:'test',role:'team',rank:3,name:'England',    flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',rating:108,change:'-1'},
  // ODI Batting
  {format:'odi',role:'batting',rank:1,name:'Virat Kohli', country:'India',   rating:871,change:'+1'},
  {format:'odi',role:'batting',rank:2,name:'Babar Azam',  country:'Pakistan',rating:858,change:'-1'},
  {format:'odi',role:'batting',rank:3,name:'Rohit Sharma',country:'India',   rating:831,change:'+0'},
  // T20 Batting
  {format:'t20',role:'batting',rank:1,name:'Suryakumar Yadav',country:'India',   rating:902,change:'+0'},
  {format:'t20',role:'batting',rank:2,name:'Babar Azam',      country:'Pakistan',rating:867,change:'+1'},
  {format:'t20',role:'batting',rank:3,name:'Virat Kohli',     country:'India',   rating:798,change:'+0'},
  // T20 Bowling
  {format:'t20',role:'bowling',rank:1,name:'Jasprit Bumrah',country:'India',      rating:844,change:'+0'},
  {format:'t20',role:'bowling',rank:2,name:'Rashid Khan',    country:'Afghanistan',rating:821,change:'+0'},
  {format:'t20',role:'bowling',rank:3,name:'Adil Rashid',    country:'England',   rating:798,change:'+1'},
];

const brackets = [{
  tournament:'ICC World Cup 2025',
  rounds:[
    { name:'Group Stage', matches:[
      {t1:'IND',f1:'🇮🇳',s1:'204/4',t2:'PAK',f2:'🇵🇰',s2:'173/9',winner:'IND',status:'completed'},
      {t1:'AUS',f1:'🇦🇺',s1:'287/6',t2:'ENG',f2:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',s2:'241/8',winner:'AUS',status:'completed'},
      {t1:'NZ', f1:'🇳🇿',s1:'289/7',t2:'SA', f2:'🇿🇦',s2:'271/9',winner:'NZ', status:'completed'},
      {t1:'SL', f1:'🇱🇰',s1:'201/8',t2:'WI', f2:'🏝️',s2:'198/7',winner:'SL', status:'completed'},
    ]},
    { name:'Semi-Finals', matches:[
      {t1:'IND',f1:'🇮🇳',s1:'220/3',t2:'AUS',f2:'🇦🇺',s2:'198/8',winner:'IND',status:'completed'},
      {t1:'NZ', f1:'🇳🇿',s1:'',     t2:'ENG',f2:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',s2:'',    winner:'',   status:'live'},
    ]},
    { name:'Final', matches:[
      {t1:'IND',f1:'🇮🇳',s1:'',t2:'TBD',f2:'🏆',s2:'',winner:'',status:'upcoming'},
    ]},
  ]
}];

// ── Seed ───────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  await Promise.all([Match,Player,Standing,ICCRanking,Bracket].map(M=>M.deleteMany({})));
  console.log('🗑️  Cleared all collections');

  await Match.insertMany(matches);      console.log(`📋 ${matches.length} matches`);
  await Player.insertMany(players);     console.log(`👤 ${players.length} players`);
  await Standing.insertMany(standings); console.log(`🏆 ${standings.length} standings`);
  await ICCRanking.insertMany(iccRankings); console.log(`🌍 ${iccRankings.length} ICC rankings`);
  await Bracket.insertMany(brackets);   console.log(`🔗 ${brackets.length} brackets`);

  console.log('\n✅ Database seeded successfully!');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });