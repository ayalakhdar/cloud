import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function TxnList({ user }){
  const [rows,setRows]=useState([]);
  const [loading,setLoading]=useState(true);

  async function load(){
    setLoading(true);
    const r = await API.get('/txns');
    setRows(r.data);
    setLoading(false);
  }
  useEffect(()=>{ load(); },[]);

  async function submitToChain(id){
    await API.post(`/txns/${id}/submit`);
    load();
  }

  return (
    <div>
      <h2>Liste transactions</h2>
      {loading ? <div>Chargement...</div> : (
        <>
          <table className="table">
            <thead><tr><th>ID</th><th>Date</th><th>Type</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{new Date(r.timestamp).toLocaleString()}</td>
                  <td>{r.type}</td>
                  <td>{r.amount} {r.currency}</td>
                  <td>{r.status}{r.blockchain_tx_hash ? ` • ${r.blockchain_tx_hash}` : ''}</td>
                  <td>
                    <Link to={`/txn/list`}>View</Link>
                    {" | "}
                    {r.status !== 'SUBMITTED' && <button onClick={()=>submitToChain(r.id)}>Submit</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
