import React, { useState, useEffect } from 'react';
// import { toast } from 'sonner';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

const mockStudents = [
  { prenom: 'Jan', nom: 'Jansen', cin: 'A12345', email: 'jan@example.com', choix: 'Beginner Dutch', status: 'Active', date_inscription: '2024-06-01' },
  { prenom: 'Marie', nom: 'de Vries', cin: 'B67890', email: 'marie@example.com', choix: 'Intermediate Dutch', status: 'Pending', date_inscription: '2024-05-15' }
];

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [date, setDate] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  }, []);

  // Filter and sort logic
  const filtered = students.filter(s =>
    (!search || s.nom.toLowerCase().includes(search.toLowerCase()) || s.prenom.toLowerCase().includes(search.toLowerCase())) &&
    (!date || s.date_inscription === date)
  );
  const sorted = [...filtered].sort((a, b) => sortDesc ? b.date_inscription?.localeCompare(a.date_inscription || '') : (a.date_inscription || '').localeCompare(b.date_inscription || ''));
  const perPage = 10;
  const paginated = sorted.slice((page-1)*perPage, page*perPage);
  const pageCount = Math.ceil(sorted.length / perPage);

  return (
    <div className="container mt-4">
      <h2>Liste des étudiants</h2>
      <div className="d-flex flex-wrap gap-2 align-items-center mb-3 sticky-top bg-white py-2">
        <input className="form-control w-auto" placeholder="Recherche par nom ou prénom" value={search} onChange={e => setSearch(e.target.value)} />
        {/* <DatePicker selected={date} onChange={d => setDate(d)} className="form-control w-auto" placeholderText="Date d'inscription" /> */}
        <button className="btn btn-outline-secondary" onClick={() => setSortDesc(s => !s)}>
          Trier: {sortDesc ? 'Plus récent' : 'Plus ancien'}
        </button>
      </div>
      {loading ? (
        <div className="text-center my-5"><span className="spinner-border" /></div>
      ) : paginated.length === 0 ? (
        <div className="text-center my-5">
          <span role="img" aria-label="empty">🇳🇱</span> Aucun étudiant trouvé.
        </div>
      ) : (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table className="table table-bordered table-hover align-middle" style={{ minWidth: 600 }}>
            <thead className="table-light">
              <tr>
                <th>Prénom</th>
                <th>Nom</th>
                <th>CIN</th>
                <th>Email</th>
                <th>Choix</th>
                <th>Status</th>
                <th>Date d'inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s, i) => (
                <tr key={i}>
                  <td>{s.prenom}</td>
                  <td>{s.nom}</td>
                  <td>{s.cin}</td>
                  <td>{s.email}</td>
                  <td>{s.choix}</td>
                  <td className={s.status === 'Active' ? 'text-success' : 'text-warning'}>{s.status}</td>
                  <td>{s.date_inscription}</td>
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
    </div>
  );
} 