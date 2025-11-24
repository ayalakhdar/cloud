import React, { useEffect, useState } from 'react';
import API from '../api';

export default function AdminUsers(){
  const [users,setUsers] = useState([]);
  const [newU, setNewU] = useState({ username:'', password:'', role:'CLIENT', email:'' });

  async function load(){ const r = await API.get('/users'); setUsers(r.data); }
  useEffect(()=>{ load(); },[]);

  async function add(){
    await API.post('/users', newU); setNewU({ username:'', password:'', role:'CLIENT', email:'' }); load();
  }

  async function del(id){
    if(!confirm('Delete user?')) return;
    await API.delete(`/users/${id}`); load();
  }

  return (
    <div>
      <h2>Gestion utilisateurs</h2>
      <div style={{display:'flex', gap:12}}>
        <input placeholder="username" value={newU.username} onChange={e=>setNewU({...newU, username:e.target.value})} />
        <input placeholder="password" value={newU.password} onChange={e=>setNewU({...newU, password:e.target.value})} />
        <select value={newU.role} onChange={e=>setNewU({...newU, role:e.target.value})}>
          <option value="CLIENT">CLIENT</option>
          <option value="FOURNISSEUR">FOURNISSEUR</option>
          <option value="COMPTABLE">COMPTABLE</option>
          <option value="AUDITEUR">AUDITEUR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <input placeholder="email" value={newU.email} onChange={e=>setNewU({...newU, email:e.target.value})} />
        <button onClick={add}>Ajouter</button>
      </div>

      <table className="table" style={{marginTop:12}}>
        <thead><tr><th>Username</th><th>Role</th><th>Email</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(u=>(
            <tr key={u.id}>
              <td>{u.username}</td><td>{u.role}</td><td>{u.email}</td>
              <td><button onClick={()=>del(u.id)}>Supprimer</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
