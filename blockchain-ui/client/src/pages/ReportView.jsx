import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function ReportView(){
  const { id } = useParams();
  const [r, setR] = useState(null);

  useEffect(()=>{ load(); },[]);

  async function load(){ const res = await API.get(`/reports/${id}`); setR(res.data);}

  if(!r) return <div>Chargement...</div>;

  return (
    <div>
      <h2>Rapport {r.id}</h2>
      <div dangerouslySetInnerHTML={{__html: r.content }} />
      <div style={{marginTop:12}}><button onClick={()=>{ alert('Téléchargement demo'); }}>Télécharger PDF (demo)</button></div>
    </div>
  );
}
