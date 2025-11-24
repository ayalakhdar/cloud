import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ user, onLogout }){
  const loc = useLocation();
  return (
    <div className="nav">
      <div style={{fontWeight:700, marginRight:20}}>Blockchain-Privé</div>
      <Link to="/" className={loc.pathname==='/'?'active':''}>Transactions</Link>
      {user && (user.role==='CLIENT' || user.role==='FOURNISSEUR') && <Link to="/txn/new">Nouvelle txn</Link>}
      {user && user.role==='COMPTABLE' && <Link to="/accountant/dashboard">Comptable</Link>}
      {user && user.role==='ADMIN' && <Link to="/admin/users">Admin</Link>}
      {user && <div style={{marginLeft:'auto'}}>{user.username} ({user.role}) <button onClick={onLogout} style={{marginLeft:8}}>Logout</button></div>}
      {!user && <Link to="/login" style={{marginLeft:'auto'}}>Login</Link>}
    </div>
  );
}
