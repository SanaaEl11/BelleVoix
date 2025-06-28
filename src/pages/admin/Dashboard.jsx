import React from 'react';
import { Typography, Grid, Card, CardContent, Avatar, Box, Paper, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, InputAdornment } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import SearchIcon from '@mui/icons-material/Search';

// Mock data for analytics
const studentsPerMonth = [
  { month: 'Jan', count: 10 },
  { month: 'Feb', count: 15 },
  { month: 'Mar', count: 20 },
  { month: 'Apr', count: 18 },
  { month: 'May', count: 25 },
  { month: 'Jun', count: 30 },
];
const paymentsPerMonth = [
  { month: 'Jan', paid: 8, unpaid: 2 },
  { month: 'Feb', paid: 12, unpaid: 3 },
  { month: 'Mar', paid: 18, unpaid: 2 },
  { month: 'Apr', paid: 15, unpaid: 3 },
  { month: 'May', paid: 22, unpaid: 3 },
  { month: 'Jun', paid: 28, unpaid: 2 },
];

// Mock students data
const mockStudents = [
  { prenom: 'Jan', nom: 'Jansen', cin: 'A12345', email: 'jan@example.com', choix: 'Beginner Dutch', status: 'Active', date_inscription: '2024-06-01' },
  { prenom: 'Marie', nom: 'de Vries', cin: 'B67890', email: 'marie@example.com', choix: 'Intermediate Dutch', status: 'Pending', date_inscription: '2024-05-15' },
  { prenom: 'Pieter', nom: 'de Groot', cin: 'C54321', email: 'pieter@example.com', choix: 'Advanced Dutch', status: 'Active', date_inscription: '2024-04-10' },
  { prenom: 'Sanne', nom: 'Bakker', cin: 'D98765', email: 'sanne@example.com', choix: 'Beginner Dutch', status: 'Active', date_inscription: '2024-03-20' },
  { prenom: 'Lisa', nom: 'Visser', cin: 'E11223', email: 'lisa@example.com', choix: 'Intermediate Dutch', status: 'Pending', date_inscription: '2024-02-05' },
  { prenom: 'Tom', nom: 'Smit', cin: 'F44556', email: 'tom@example.com', choix: 'Advanced Dutch', status: 'Active', date_inscription: '2024-01-12' },
  // ...add more for demo
];

// StatusBadge for student status
function StatusBadge({ status }) {
  const isActive = status === 'Active' || status === 'Actif';
  const color = isActive ? '#dc3545' : '#111';
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
      {status === 'Active' ? 'Actif' : status === 'Pending' ? 'En attente' : status}
    </Box>
  );
}

export default function Dashboard({ statCards }) {
  // Table state
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Filtered students
  const filteredStudents = mockStudents.filter(s =>
    s.nom.toLowerCase().includes(search.toLowerCase()) ||
    s.prenom.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.cin.toLowerCase().includes(search.toLowerCase())
  );
  const paginatedStudents = filteredStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', px: { xs: 0.5, sm: 2, md: 4 } }}>
      <style>{`
        @media (min-width: 900px) {
          .dashboard-item { width: 270px; max-width: 100%; }
          .dashboard-analytics-card { width: 900px; max-width: 100%; }
        }
        @media (max-width: 899px) {
          .dashboard-item, .dashboard-analytics-card { width: 100% !important; }
        }
      `}</style>
      {/* Welcome Section */}
      <Paper elevation={3} sx={{
        p: { xs: 1, sm: 2, md: 3 },
        mb: { xs: 2, md: 4 },
        background: 'linear-gradient(120deg, #fff 70%, #F7C01522 100%)',
        borderRadius: 4,
        boxShadow: '0 4px 24px 0 rgba(220,53,69,0.08)',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { md: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 2, md: 4 },
        width: '100%',
        maxWidth: '100%',
      }}>
        <Box sx={{ mb: { xs: 2, md: 0 }, width: { xs: '100%', md: 'auto' } }}>
          <Typography variant="h4" sx={{
            fontWeight: 900,
            background: 'linear-gradient(90deg, #dc3545 60%, #F7C015 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1,
            fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2.1rem' },
            letterSpacing: 0.5,
          }}>
            Bienvenue, Admin
          </Typography>
          <Typography variant="subtitle2" sx={{ color: '#1c2526', fontWeight: 500, mb: 2, fontSize: { xs: '0.95rem', sm: '1rem', md: '1.08rem' } }}>
            Gérez votre école Belle Voix, suivez les inscriptions et paiements des étudiants, et consultez les analyses ci-dessous.
          </Typography>
        </Box>
        <Grid container spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
          {statCards.map((card) => (
            <Grid item xs={12} sm={6} md={3} key={card.title} className="dashboard-item" sx={{ display: 'flex', justifyContent: 'center', maxWidth: { xs: '100%', sm: '100%', md: 350 } }}>
              <Card sx={{
                display: 'flex',
                alignItems: 'center',
                p: { xs: 1, sm: 1.5 },
                boxShadow: '0 2px 16px 0 rgba(0,0,0,0.07)',
                borderRadius: 2,
                border: '2px solid #f0f0f0',
                transition: 'all 0.3s ease',
                width: '100%',
                minWidth: 0,
                maxWidth: { xs: '100%', sm: '100%', md: 350 },
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px 0 rgba(0,0,0,0.15)',
                  border: '2px solid #dc3545'
                }
              }}>
                {card.icon}
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.92rem', sm: '0.98rem' } }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h6" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(90deg, #dc3545 60%, #F7C015 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                  }}>
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      <Divider sx={{ mb: { xs: 2, md: 4 }, borderColor: '#F7C015', borderBottomWidth: 3, borderRadius: 2 }} />
      {/* Analytics Section */}
      <Paper elevation={2} sx={{
        p: { xs: 1, sm: 1.5, md: 3 },
        background: 'linear-gradient(120deg, #fff 70%, #dc354522 100%)',
        borderRadius: 4,
        boxShadow: '0 4px 24px 0 rgba(220,53,69,0.08)',
        mb: { xs: 2, md: 3 },
        width: '100%',
        maxWidth: '100%',
      }}>
        <Typography variant="h5" sx={{
          fontWeight: 800,
          mb: { xs: 2, md: 3 },
          color: '#dc3545',
          letterSpacing: 0.5,
          textShadow: '0 2px 8px #f7c01533',
          fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
        }}>
          Statistiques
        </Typography>
        <Grid container spacing={2} justifyContent="center" direction={{ xs: 'column', md: 'row' }}>
          <Grid item xs={12} md={6} className="dashboard-analytics-card" sx={{ mb: { xs: 2, md: 3 }, width: '100%', maxWidth: '100%' }}>
            <Card sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, boxShadow: '0 6px 24px 0 rgba(220,53,69,0.10)', border: '2px solid #f0f0f0', background: 'linear-gradient(120deg, #fff 80%, #f7c01511 100%)', position: 'relative', overflow: 'visible', minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, fontSize: { xs: '1rem', sm: '1.08rem', md: '1.15rem' }, background: 'linear-gradient(90deg, #F7C015 60%, #dc3545 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: 0.5, fontFamily: 'Poppins, Arial, sans-serif' }}>
                Inscriptions des étudiants par mois
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={studentsPerMonth} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontWeight: 700, fontSize: 13, fontFamily: 'Poppins, Arial, sans-serif' }} />
                  <YAxis allowDecimals={false} tick={{ fontWeight: 700, fontSize: 13, fontFamily: 'Poppins, Arial, sans-serif' }} label={{ value: 'Nombre', angle: -90, position: 'insideLeft', fontSize: 13, fill: '#dc3545', fontWeight: 900, fontFamily: 'Poppins, Arial, sans-serif' }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #F7C015', borderRadius: 8, fontWeight: 900, fontSize: 14, fontFamily: 'Poppins, Arial, sans-serif' }} cursor={{ fill: '#f7c01522' }} />
                  <Line type="monotone" dataKey="count" stroke="#dc3545" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} className="dashboard-analytics-card" sx={{ width: '100%', maxWidth: '100%' }}>
            <Card sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, boxShadow: '0 6px 24px 0 rgba(0,0,0,0.08)', border: '2px solid #e0e0e0', background: '#fff', position: 'relative', overflow: 'visible', minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5, fontSize: { xs: '1rem', sm: '1.08rem', md: '1.15rem' }, color: '#222', letterSpacing: 0.5, fontFamily: 'Poppins, Arial, sans-serif' }}>
                Paiements des étudiants par mois
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={paymentsPerMonth} margin={{ top: 20, right: 40, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="paidGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F7C015" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#fffbe6" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="unpaidGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#dc3545" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#fff0f0" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fontWeight: 700, fontSize: 13, fontFamily: 'Poppins, Arial, sans-serif' }} />
                  <YAxis allowDecimals={false} tick={{ fontWeight: 700, fontSize: 13, fontFamily: 'Poppins, Arial, sans-serif' }} label={{ value: 'Nombre', angle: -90, position: 'insideLeft', fontSize: 13, fill: '#dc3545', fontWeight: 900, fontFamily: 'Poppins, Arial, sans-serif' }} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #F7C015', borderRadius: 12, fontWeight: 500, fontSize: 15, fontFamily: 'Poppins, Arial, sans-serif', boxShadow: '0 2px 8px #F7C01533' }} cursor={{ fill: '#f7c01511' }} />
                  <Legend
                    verticalAlign="top"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: 10, fontWeight: 700, fontSize: 14, fontFamily: 'Poppins, Arial, sans-serif' }}
                  />
                  <Bar dataKey="paid" fill="url(#paidGradient)" name="Payé" radius={[8, 8, 0, 0]} barSize={18} />
                  <Bar dataKey="unpaid" fill="url(#unpaidGradient)" name="Non payé" radius={[8, 8, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      <Paper elevation={2} sx={{ mt: { xs: 2, md: 4 }, p: { xs: 1, sm: 1.5, md: 3 }, borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(220,53,69,0.08)', width: '100%', maxWidth: '100%' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 2, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#dc3545', fontSize: { xs: '1rem', sm: '1.1rem' } }}>Liste des étudiants</Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Recherche par nom, prénom, email, CIN..."
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
        <TableContainer sx={{ maxWidth: '100vw', overflowX: 'auto' }}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.map((s, i) => (
                <TableRow key={i}>
                  <TableCell>{s.prenom}</TableCell>
                  <TableCell>{s.nom}</TableCell>
                  <TableCell>{s.cin}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.choix}</TableCell>
                  <TableCell>
                    <StatusBadge status={s.status === 'Active' ? 'Actif' : s.status === 'Pending' ? 'En attente' : s.status} />
                  </TableCell>
                  <TableCell>{s.date_inscription}</TableCell>
                </TableRow>
              ))}
              {paginatedStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: '#dc3545', fontWeight: 600 }}>
                    Aucun étudiant trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredStudents.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Lignes par page"
        />
      </Paper>
    </Box>
  );
} 