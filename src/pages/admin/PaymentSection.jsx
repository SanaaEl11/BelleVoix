import React, { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

const mockStudents = [
  { id: '1', prenom: 'Jan', nom: 'Jansen' },
  { id: '2', prenom: 'Marie', nom: 'de Vries' }
];
const mockPayments = [
  { studentName: 'Jan Jansen', month: '2024-06', status: 'Paid', date_payment: '2024-06-05' },
  { studentName: 'Marie de Vries', month: '2024-05', status: 'Unpaid', date_payment: '' }
];

export default function PaymentSection() {
  const [form, setForm] = useState({ student: '', month: '', status: 'Paid' });
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPayments(mockPayments);
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setPayments(prev => [
        ...prev,
        {
          studentName: students.find(s => s.id === form.student)?.prenom + ' ' + students.find(s => s.id === form.student)?.nom,
          month: form.month,
          status: form.status,
          date_payment: form.status === 'Paid' ? new Date().toISOString().slice(0, 10) : ''
        }
      ]);
      setForm({ student: '', month: '', status: 'Paid' });
      setLoading(false);
    }, 1000);
  };

  // Filter/search logic
  const filtered = payments.filter(p =>
    (!search || (p.studentName && p.studentName.toLowerCase().includes(search.toLowerCase())) || (p.month && p.month.toLowerCase().includes(search.toLowerCase())))
  );
  const perPage = 10;
  const paginated = filtered.slice((page-1)*perPage, page*perPage);
  const pageCount = Math.ceil(filtered.length / perPage);

  return (
    <div className="container mt-4">
      <h2>Paiement des étudiants</h2>
      <form className="row g-3 align-items-end mb-4" onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label className="form-label">Étudiant</label>
          <select className="form-select" name="student" value={form.student} onChange={handleChange} required>
            <option value="">Sélectionnez un étudiant</option>
            {students.map((s, i) => (
              <option key={i} value={s.id}>{s.prenom} {s.nom}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Mois</label>
          <input type="month" className="form-control" name="month" value={form.month} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <label className="form-label">Statut</label>
          <select className="form-select" name="status" value={form.status} onChange={handleChange} required>
            <option value="Paid">Payé</option>
            <option value="Unpaid">Non payé</option>
          </select>
        </div>
        <div className="col-md-2 d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm" /> : 'Enregistrer'}
          </button>
        </div>
      </form>
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3 sticky-top bg-white py-2">
        <input className="form-control w-auto" placeholder="Recherche par étudiant ou mois" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      {loading ? (
        <div className="text-center my-5"><span className="spinner-border" /></div>
      ) : paginated.length === 0 ? (
        <div className="text-center my-5">
          <span role="img" aria-label="empty">🇳🇱</span> Aucun paiement trouvé.
        </div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table className="table table-bordered table-hover align-middle" style={{ minWidth: 600 }}>
            <thead className="table-light">
              <tr>
                <th>Étudiant</th>
                <th>Mois</th>
                <th>Statut</th>
                <th>Date de paiement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((p, i) => (
                <tr key={i}>
                  <td>{p.studentName}</td>
                  <td>{p.month}</td>
                  <td className={p.status === 'Paid' ? 'status-paid' : 'status-unpaid'}>{p.status === 'Paid' ? 'Payé' : 'Non payé'}</td>
                  <td>{p.date_payment || 'N/A'}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2">Éditer</button>
                    <button className="btn btn-danger btn-sm">Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          <li className={`page-item${page === 1 ? ' disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => Math.max(1, p-1))}>Précédent</button></li>
          {[...Array(pageCount)].map((_, i) => (
            <li key={i} className={`page-item${page === i+1 ? ' active' : ''}`}><button className="page-link" onClick={() => setPage(i+1)}>{i+1}</button></li>
          ))}
          <li className={`page-item${page === pageCount ? ' disabled' : ''}`}><button className="page-link" onClick={() => setPage(p => Math.min(pageCount, p+1))}>Suivant</button></li>
        </ul>
      </nav>
      <style>{`
        .status-paid { color: green; font-weight: bold; }
        .status-unpaid { color: red; font-weight: bold; }
      `}</style>
    </div>
  );
} 