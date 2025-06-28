import React from 'react';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Typography, Select, MenuItem, IconButton, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box as MuiBox } from '@mui/material';
import { db } from '../../firebase';
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

function StatusBadge({ status }) {
  const isActive = status === 'Actif';
  const color = isActive ? '#dc3545' : '#111';
  return (
    <MuiBox
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
        boxShadow: isActive
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
    </MuiBox>
  );
}

export default function StudentList() {
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [editIndex, setEditIndex] = React.useState(null);
  const [editForm, setEditForm] = React.useState({ prenom: '', nom: '', cin: '', email: '', choix: '', status: '' });
  const [deleteIndex, setDeleteIndex] = React.useState(null);
  const [choices, setChoices] = React.useState([]);

  // Fetch students from Firestore
  React.useEffect(() => {
    const unsub = onSnapshot(collection(db, 'students'), (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    const unsubChoices = onSnapshot(collection(db, 'choices'), (snapshot) => {
      setChoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsub(); unsubChoices(); };
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (index, newStatus) => {
    const student = students[index];
    if (student && student.id) {
      await updateDoc(doc(db, 'students', student.id), { status: newStatus });
    }
  };

  const handleEdit = (index) => {
    const student = students[index];
    setEditForm({
      prenom: student.prenom,
      nom: student.nom,
      cin: student.cin,
      email: student.email,
      choix: student.choix,
      status: student.status === 'Active' ? 'Actif' : student.status === 'Pending' ? 'En attente' : student.status,
    });
    setEditIndex(index);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    const student = students[editIndex];
    if (student && student.id) {
      await updateDoc(doc(db, 'students', student.id), {
        prenom: editForm.prenom,
        nom: editForm.nom,
        cin: editForm.cin,
        email: editForm.email,
        choix: editForm.choix,
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
    const student = students[deleteIndex];
    if (student && student.id) {
      await deleteDoc(doc(db, 'students', student.id));
    }
    setDeleteIndex(null);
  };

  const handleDeleteCancel = () => {
    setDeleteIndex(null);
  };

  const paginatedStudents = students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={2} sx={{ mt: 3, p: { xs: 1, sm: 2 }, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(220,53,69,0.08)' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#dc3545', mb: 2 }}>Liste des étudiants inscrits</Typography>
      {loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <span className="spinner-border" />
        </Box>
      ) : (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer sx={{ minWidth: 600 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>CIN</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Cours</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell>Date d'inscription</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStudents.map((s, i) => (
                  <TableRow key={s.id || i}>
                    <TableCell>{s.prenom}</TableCell>
                    <TableCell>{s.nom}</TableCell>
                    <TableCell>{s.cin}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.choix}</TableCell>
                    <TableCell>
                      <Select
                        value={s.status === 'Active' ? 'Actif' : s.status === 'Pending' ? 'En attente' : s.status}
                        onChange={e => handleStatusChange(i + page * rowsPerPage, e.target.value)}
                        size="small"
                        sx={{ minWidth: 110, fontWeight: 600, display: 'none' }}
                      >
                        <MenuItem value="Actif">Actif</MenuItem>
                        <MenuItem value="En attente">En attente</MenuItem>
                      </Select>
                      <StatusBadge status={s.status} />
                    </TableCell>
                    <TableCell>{s.date_inscription}</TableCell>
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
                {paginatedStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ color: '#dc3545', fontWeight: 600 }}>
                      Aucun étudiant trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      <TablePagination
        component="div"
        count={students.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Lignes par page"
      />
      {/* Edit Dialog */}
      <Dialog open={editIndex !== null} onClose={handleEditCancel}>
        <DialogTitle>Éditer l'étudiant</DialogTitle>
        <DialogContent>
          <TextField
            label="Prénom"
            name="prenom"
            value={editForm.prenom}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Nom"
            name="nom"
            value={editForm.nom}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="CIN"
            name="cin"
            value={editForm.cin}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={editForm.email}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Cours"
            name="choix"
            select
            value={editForm.choix}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          >
            {choices.map((c) => (
              <MenuItem key={c.id} value={c.nom}>{c.nom}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Statut"
            name="status"
            value={editForm.status}
            onChange={handleEditChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Actif">Actif</MenuItem>
            <MenuItem value="En attente">En attente</MenuItem>
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
        <DialogTitle>Supprimer l'étudiant</DialogTitle>
        <DialogContent>
          Voulez-vous vraiment supprimer cet étudiant ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">Annuler</Button>
          <Button onClick={confirmDelete} color="error">Supprimer</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
} 