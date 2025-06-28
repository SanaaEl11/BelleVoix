import React from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, IconButton, Box, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { db } from '../../firebase';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

function StatusBadge({ status }) {
  const isPaid = status === 'Payé';
  const color = isPaid ? '#dc3545' : '#111';
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 2.2,
        py: 0.5,
        borderRadius: 999,
        fontWeight: 700,
        fontSize: '0.93rem',
        color,
        background: 'transparent',
        border: `1.2px solid ${color}`,
        boxShadow: isPaid
          ? '0 4px 24px 0 rgba(220,53,69,0.13)'
          : '0 4px 24px 0 rgba(0,0,0,0.13)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        transition: 'all 0.2s',
        textShadow: '0 1px 4px #2222',
        letterSpacing: 0.2,
        minWidth: 70,
        justifyContent: 'center',
        textAlign: 'center',
        textTransform: 'uppercase',
      }}
    >
      {status}
    </Box>
  );
}

export default function PaymentList() {
  const [payments, setPayments] = React.useState([]);
  const [students, setStudents] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editIndex, setEditIndex] = React.useState(null);
  const [editForm, setEditForm] = React.useState({ amount: '', month: '', status: '' });
  const [deleteIndex, setDeleteIndex] = React.useState(null);

  React.useEffect(() => {
    const unsub = onSnapshot(collection(db, 'payments'), (snapshot) => {
      setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubStudents = onSnapshot(collection(db, 'students'), (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsub(); unsubStudents(); };
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (index) => {
    const payment = payments[index];
    setEditForm({
      amount: payment.amount,
      month: payment.month,
      status: payment.status,
    });
    setEditIndex(index);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    const payment = payments[editIndex];
    if (payment && payment.id) {
      await updateDoc(doc(db, 'payments', payment.id), {
        amount: editForm.amount,
        month: editForm.month,
        status: editForm.status,
      });
    }
    setEditIndex(null);
  };

  const handleEditCancel = () => {
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
  };

  const confirmDelete = async () => {
    const payment = payments[deleteIndex];
    if (payment && payment.id) {
      await deleteDoc(doc(db, 'payments', payment.id));
    }
    setDeleteIndex(null);
  };

  const handleDeleteCancel = () => {
    setDeleteIndex(null);
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.prenom} ${student.nom}` : 'Inconnu';
  };

  const filteredPayments = payments.filter(p => {
    const studentName = getStudentName(p.studentId).toLowerCase();
    return (
      studentName.includes(search.toLowerCase()) ||
      (p.month || '').includes(search) ||
      String(p.amount || '').includes(search) ||
      (p.status || '').toLowerCase().includes(search.toLowerCase())
    );
  });
  const paginatedPayments = filteredPayments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={2} sx={{ mt: { xs: 2, md: 4 }, p: { xs: 1, sm: 1.5, md: 3 }, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(220,53,69,0.08)', background: '#fff', border: '2px solid #f0f0f0' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#dc3545', fontSize: { xs: '1rem', sm: '1.1rem' } }}>Liste des paiements</Typography>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Recherche par étudiant, mois, montant, statut..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{
            minWidth: { xs: '100%', sm: 240 },
            background: '#fff',
            borderRadius: 3,
            boxShadow: '0 2px 8px 0 rgba(220,53,69,0.07)',
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              fontSize: '1rem',
              fontWeight: 500,
              paddingRight: 0,
              '& fieldset': {
                borderColor: '#f0f0f0',
              },
              '&:hover fieldset': {
                borderColor: '#F7C015',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#dc3545',
                boxShadow: '0 0 0 2px #F7C01533',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#dc3545', fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <TableContainer sx={{ minWidth: 600 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Étudiant</TableCell>
                <TableCell>Mois</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedPayments.map((p, i) => (
                <TableRow key={p.id || i}>
                  <TableCell>{getStudentName(p.studentId)}</TableCell>
                  <TableCell>{p.month}</TableCell>
                  <TableCell>{p.amount} €</TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <IconButton sx={{ color: '#F7C015' }} onClick={() => handleEdit(i + page * rowsPerPage)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(i + page * rowsPerPage)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: '#dc3545', fontWeight: 600 }}>
                    Aucun paiement trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <TablePagination
        component="div"
        count={filteredPayments.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Lignes par page"
      />
      {/* Edit Dialog */}
      <Dialog open={editIndex !== null} onClose={handleEditCancel}>
        <DialogTitle>Éditer le paiement</DialogTitle>
        <DialogContent>
          <TextField
            label="Montant"
            name="amount"
            type="number"
            value={editForm.amount}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mois"
            name="month"
            type="month"
            value={editForm.month}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Statut"
            name="status"
            value={editForm.status}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Payé">Payé</MenuItem>
            <MenuItem value="Non payé">Non payé</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditCancel} color="inherit">Annuler</Button>
          <Button
            onClick={handleEditSave}
            sx={{
              background: 'linear-gradient(90deg, #dc3545 60%, #F7C015 100%)',
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px 0 rgba(220,53,69,0.10)',
              '&:hover': {
                background: 'linear-gradient(90deg, #F7C015 60%, #dc3545 100%)',
                color: '#fff',
              },
            }}
            variant="contained"
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete confirmation dialog */}
      <Dialog open={deleteIndex !== null} onClose={handleDeleteCancel}>
        <DialogTitle>Supprimer le paiement</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer ce paiement ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">Annuler</Button>
          <Button onClick={confirmDelete} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
} 