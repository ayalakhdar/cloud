import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import API, { setToken } from './api';
import { saveAuth, loadAuth, clearAuth } from './auth';

import Navbar from './components/navbar';
import Login from './pages/Login';
import TxnNew from './pages/TxnNew';
import TxnList from './pages/TxnList';
import Dashboard from './pages/Dashboard';
import AdminUsers from './pages/AdminUsers';
import ReportView from './pages/ReportView';

function App(){
  const [user, setUser] = useState(loadAuth()?.user || null);
  const nav = useNavigate();

  useEffect(()=>{
    const auth = loadAuth();
    if(auth){ setToken(auth.token); setUser(auth.user); }
  }, []);

  function onLogin(data){
    saveAuth(data); setToken(data.token); setUser(data.user); nav('/');
  }
  function onLogout(){ clearAuth(); setUser(null); setToken(null); nav('/login'); }

  return (
    <>
      <Navbar user={user} onLogout={onLogout}/>
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login onLogin={onLogin} />} />
          <Route path="/" element={<TxnList user={user} />} />
          <Route path="/txn/new" element={<TxnNew user={user} />} />
          <Route path="/txn/list" element={<TxnList user={user} />} />
          <Route path="/accountant/dashboard" element={<Dashboard user={user} />} />
          <Route path="/report/:id" element={<ReportView user={user} />} />
          <Route path="/admin/users" element={<AdminUsers user={user} />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </>
  );
}

export default App;
