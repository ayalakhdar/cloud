import React, { useState } from 'react';
import API from '../api';

export default function Login({ onLogin }){
  const [username,setUsername]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState(null);

  async function submit(e){
    e.preventDefault();
    try{
      const r = await API.post('/auth/login', { username, password });
      onLogin(r.data);
    }catch(err){
      setErr(err?.response?.data?.error || 'Erreur connexion');
    }
  }

  return (
    <div>
      <h2>Connexion</h2>
      <form className="form" onSubmit={submit}>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">Se connecter</button>
        {err && <div style={{color:'red'}}>{err}</div>}
      </form>
    </div>
  );
}
