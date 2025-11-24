const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { db, initDB, generateId, authMiddleware, roleRequired, JWT_SECRET, submitToBlockchain } = require('./helpers');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

const PORT = process.env.PORT || 4000;

(async ()=>{
  await initDB();

  // --- Auth
  app.post('/api/auth/login', async (req,res)=>{
    const { username, password } = req.body;
    await db.read();
    const user = db.data.users.find(u => u.username === username && u.password === password);
    if(!user) return res.status(401).json({error:'invalid credentials'});
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, email: user.email } });
  });

  // --- Users management (admin)
  app.get('/api/users', authMiddleware, roleRequired('ADMIN'), async (req,res)=>{
    await db.read(); res.json(db.data.users);
  });

  app.post('/api/users', authMiddleware, roleRequired('ADMIN'), async (req,res)=>{
    const { username, password, role, email } = req.body;
    await db.read();
    const id = generateId('u');
    db.data.users.push({ id, username, password, role, email });
    await db.write();
    res.json({ id, username, role, email });
  });

  app.put('/api/users/:id', authMiddleware, roleRequired('ADMIN'), async (req,res)=>{
    const { id } = req.params; const { role, email } = req.body;
    await db.read();
    const u = db.data.users.find(x => x.id === id);
    if(!u) return res.status(404).json({error:'user not found'});
    if(role) u.role = role;
    if(email) u.email = email;
    await db.write();
    res.json(u);
  });

  app.delete('/api/users/:id', authMiddleware, roleRequired('ADMIN'), async (req,res)=>{
    const { id } = req.params; await db.read();
    db.data.users = db.data.users.filter(x=>x.id !== id); await db.write();
    res.json({ ok:true });
  });

  // --- Transactions
  app.post('/api/txns', authMiddleware, roleRequired('CLIENT','FOURNISSEUR','COMPTABLE','ADMIN'), async (req,res)=>{
    const payload = req.body;
    await db.read();
    const tx = {
      id: generateId('tx'),
      account_id: payload.account_id || 'acc-default',
      counterparty: payload.counterparty || '',
      type: payload.type || 'sale',
      amount: Number(payload.amount) || 0,
      currency: payload.currency || 'MAD',
      description: payload.description || '',
      timestamp: new Date().toISOString(),
      created_by: req.user.username,
      blockchain_tx_hash: null,
      status: 'DRAFT'
    };
    db.data.transactions.unshift(tx);
    await db.write();
    res.json(tx);
  });

  app.get('/api/txns', authMiddleware, async (req,res)=>{
    await db.read();
    // clients see own txns unless comptable/auditeur/admin
    if(['COMPTABLE','AUDITEUR','ADMIN'].includes(req.user.role)){
      return res.json(db.data.transactions);
    } else {
      const own = db.data.transactions.filter(t => t.created_by === req.user.username);
      return res.json(own);
    }
  });

  app.get('/api/txns/:id', authMiddleware, async (req,res)=>{
    await db.read();
    const tx = db.data.transactions.find(t => t.id === req.params.id);
    if(!tx) return res.status(404).json({error:'not found'});
    // check visibility
    if(!['COMPTABLE','AUDITEUR','ADMIN'].includes(req.user.role) && tx.created_by !== req.user.username){
      return res.status(403).json({error:'forbidden'});
    }
    res.json(tx);
  });

  // Submit to blockchain (simulate)
  app.post('/api/txns/:id/submit', authMiddleware, roleRequired('COMPTABLE','ADMIN','CLIENT','FOURNISSEUR'), async (req,res)=>{
    await db.read();
    const tx = db.data.transactions.find(t => t.id === req.params.id);
    if(!tx) return res.status(404).json({error:'not found'});
    const bc = await submitToBlockchain(tx); // stub
    tx.blockchain_tx_hash = bc.txHash;
    tx.status = 'SUBMITTED';
    tx.blockNumber = bc.blockNumber;
    tx.submittedAt = bc.timestamp;
    await db.write();
    res.json(tx);
  });

  // --- Reports (IA stub)
  app.post('/api/reports/generate', authMiddleware, roleRequired('COMPTABLE','ADMIN'), async (req,res)=>{
    const { from, to, scope } = req.body || {};
    await db.read();
    // simple aggregation
    const txns = db.data.transactions.filter(t=>{
      // naive date filter
      return true;
    }).slice(0,100);
    // create a fake IA summary
    const report = {
      id: generateId('r'),
      generated_by: req.user.username,
      query: { from, to, scope },
      content: `<h1>Rapport généré (simulé)</h1><p>Résumé: ${txns.length} transactions analysées.</p>`,
      created_at: new Date().toISOString()
    };
    db.data.reports.unshift(report);
    await db.write();
    res.json(report);
  });

  app.get('/api/reports', authMiddleware, roleRequired('COMPTABLE','ADMIN','AUDITEUR'), async (req,res)=>{
    await db.read(); res.json(db.data.reports);
  });

  app.get('/api/reports/:id', authMiddleware, roleRequired('COMPTABLE','ADMIN','AUDITEUR'), async (req,res)=>{
    await db.read(); const r = db.data.reports.find(x=>x.id===req.params.id);
    if(!r) return res.status(404).json({error:'not found'});
    res.json(r);
  });

  // --- health
  app.get('/api/ping', (req,res)=> res.json({ok:true, time: new Date().toISOString()}));

  app.listen(PORT, ()=> console.log(`API server listening ${PORT}`));
})();
