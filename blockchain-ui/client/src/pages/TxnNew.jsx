import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function TxnNew({ user }){
  const nav = useNavigate();
  const [type,setType]=useState('sale');
  const [amount,setAmount]=useState('');
  const [counterparty,setCounterparty]=useState('');
  const [desc,setDesc]=useState('');
  const [msg,setMsg]=useState('');

  async function submit(e){
    e.preventDefault();
    try{
      const res = await API.post('/txns', { type, amount, counterparty, description:desc });
      setMsg('Transaction saved (id: ' + res.data.id + ')');
      // optional: submit to blockchain immediately
      // await API.post(`/txns/${res.data.id}/submit`);
      nav('/txn/list');
    }catch(e){
      setMsg('Erreur');
    }
  }

  return (
    <div>
      <h2>Nouvelle transaction</h2>
      <form className="form" onSubmit={submit}>
        <label>Type
          <select value={type} onChange={e=>setType(e.target.value)}>
            <option value="sale">Vente</option>
            <option value="purchase">Achat</option>
            <option value="salary">Salaire</option>
          </select>
        </label>
        <input placeholder="Montant" value={amount} onChange={e=>setAmount(e.target.value)} />
        <input placeholder="Contrepartie" value={counterparty} onChange={e=>setCounterparty(e.target.value)} />
        <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} />
        <button type="submit">Enregistrer</button>
      </form>
      {msg && <div style={{marginTop:8}}>{msg}</div>}
    </div>
  );
}
