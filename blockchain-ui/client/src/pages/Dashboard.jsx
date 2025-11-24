import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

export default function Dashboard({ user }){
  const [txns, setTxns] = useState([]);
  const [reportList,setReportList] = useState([]);

  useEffect(()=>{ load(); }, []);

  async function load(){
    const r = await API.get('/txns'); setTxns(r.data);
    const rr = await API.get('/reports'); setReportList(rr.data);
  }

  async function generateReport(){
    const res = await API.post('/reports/generate', { from:null, to:null });
    alert('Report generated: ' + res.data.id);
    load();
  }

  // prepare charts
  const timeseries = txns.slice(0,20).reverse().map(t => ({ x: new Date(t.timestamp).toLocaleDateString(), y: Number(t.amount) }));
  const chartData = { labels: timeseries.map(d=>d.x), datasets:[{ label:'Montant', data: timeseries.map(d=>d.y), fill:false }] };
  const types = txns.reduce((acc,t)=>{ acc[t.type] = (acc[t.type]||0)+Number(t.amount); return acc; }, {});
  const pie = { labels: Object.keys(types), datasets:[{ data: Object.values(types) }]};

  return (
    <div>
      <h2>Tableau de bord Comptable</h2>
      <div className="kpis">
        <div className="kpi">Total txns: {txns.length}</div>
        <div className="kpi">Total amount: {txns.reduce((s,t)=>s+Number(t.amount),0)}</div>
        <div className="kpi">Submitted: {txns.filter(t=>t.status==='SUBMITTED').length}</div>
      </div>

      <div style={{display:'flex', gap:12}}>
        <div style={{flex:1}}>
          <h3>Montant par date</h3>
          <Line data={chartData} />
        </div>
        <div style={{width:300}}>
          <h3>Répartition par type</h3>
          <Pie data={pie} />
        </div>
      </div>

      <div style={{marginTop:16}}>
        <button onClick={generateReport}>Générer rapport IA</button>
      </div>

      <div style={{marginTop:16}}>
        <h3>Rapports</h3>
        <ul>
          {reportList.map(r=>(
            <li key={r.id}><Link to={`/report/${r.id}`}>{r.id} — {r.created_at}</Link></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
