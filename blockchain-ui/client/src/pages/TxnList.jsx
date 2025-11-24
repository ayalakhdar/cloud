import React, { useEffect, useState, useCallback } from 'react';
import API from '../api';
import { Link } from 'react-router-dom';

export default function TxnList({ user }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingId, setSubmittingId] = useState(null);

  // derive current user info (safe even if user is null)
  const currentUserId = user?.id || null;
  const currentUserRole = user?.role || null;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await API.get('/txns');
      setRows(r.data || []);
    } catch (err) {
      console.error('Failed to load transactions', err);
      setError(err?.response?.data?.error || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function submitToChain(id) {
    if (!window.confirm('Confirmer la soumission de cette transaction au blockchain ?')) return;
    try {
      setSubmittingId(id);
      await API.post(`/txns/${id}/submit`);
      // refresh list after successful submit
      await load();
    } catch (err) {
      console.error('Submit failed', err);
      alert(err?.response?.data?.error || 'Échec de la soumission');
    } finally {
      setSubmittingId(null);
    }
  }

  function canSubmit(tx) {
    // Privileged roles can submit any tx
    const privileged = ['COMPTABLE', 'ADMIN'];
    if (privileged.includes(currentUserRole)) return true;
    // Otherwise only the owner can submit
    return tx.created_by === currentUserId;
  }

  return (
    <div>
      <h2>Liste transactions</h2>

      {loading && <div>Chargement...</div>}

      {!loading && error && (
        <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
      )}

      {!loading && !error && (
        <>
          {rows.length === 0 ? (
            <div>Aucune transaction trouvée.</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.id}</td>
                    <td>{tx.timestamp ? new Date(tx.timestamp).toLocaleString() : '-'}</td>
                    <td>{tx.type}</td>
                    <td>{tx.amount} {tx.currency}</td>
                    <td>
                      {tx.status}
                      {tx.blockchain_tx_hash ? ` • ${tx.blockchain_tx_hash}` : ''}
                    </td>
                    <td>
                      <Link to={`/txn/list`}>View</Link>
                      {" | "}
                      {tx.status !== 'SUBMITTED' && canSubmit(tx) && (
                        <button
                          onClick={() => submitToChain(tx.id)}
                          disabled={submittingId === tx.id}
                        >
                          {submittingId === tx.id ? 'Submitting...' : 'Submit'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
