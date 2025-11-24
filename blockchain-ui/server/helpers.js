const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');
const path = require('path');
const jwt = require('jsonwebtoken');

const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);

// --- IMPORTANT: supply default data as the second argument to Low
const defaultData = { users: [], transactions: [], reports: [] };
const db = new Low(adapter, { defaultData }); // <- fix: provide defaultData

const JWT_SECRET = "changeme_in_prod";

async function initDB(){
  await db.read();
  // If using older lowdb variants, ensure data exists:
  db.data = db.data ?? defaultData;
  await db.write();
}

function generateId(prefix='id'){ return `${prefix}-${nanoid(8)}`; }

function authMiddleware(req,res,next){
  const auth = req.headers.authorization;
  if(!auth){ return res.status(401).json({error:'missing auth'}); }
  const token = auth.split(' ')[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(e){
    return res.status(401).json({error:'invalid token'});
  }
}

function roleRequired(...allowed){
  return (req,res,next)=>{
    if(!req.user) return res.status(401).json({error:'not authenticated'});
    if(allowed.includes(req.user.role)) return next();
    return res.status(403).json({error:'forbidden'});
  };
}

// Stub: simulate submit to blockchain and return txHash
async function submitToBlockchain(tx){
  // In production: call Fabric/Quorum SDK here.
  // Return simulated hash + block number + timestamp
  return {
    txHash: '0x' + nanoid(16),
    blockNumber: Math.floor(Math.random()*10000),
    timestamp: new Date().toISOString()
  };
}

module.exports = { db, initDB, generateId, authMiddleware, roleRequired, JWT_SECRET, submitToBlockchain };
