import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { IoIosArrowForward } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { GrUserSettings } from "react-icons/gr";
import { TfiSettings } from "react-icons/tfi";
import { GoSignOut } from "react-icons/go";
import { FaSignOutAlt } from "react-icons/fa";
import logo from '../assets/logo.png';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import AjouterOrder from './admin/AjouterOrder';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AddStudentForm from './admin/AddStudentForm';
import Dashboard from './admin/Dashboard';
import StudentList from './admin/StudentList';
import AddPayment from './admin/AddPayment';
import PaymentList from './admin/PaymentList';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import GererChoix from './admin/GererChoix';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import GroupIcon from '@mui/icons-material/Group';
import CreerGroupe from './admin/CreerGroupe';
import ListGroupe from './admin/ListGroupe';

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

const Main = styled('main')(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: 0,
  background: '#f8f9fa',
  minHeight: '100vh',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon /> },
  { 
    text: 'Inscription', 
    icon: <AssignmentIndIcon />,
    subItems: [
      { text: 'Ajouter Etudiants' },
      { text: 'Liste des Etudiants' },
    ]
  },
  { 
    text: 'Paiement',
    icon: <MonetizationOnIcon />,
    subItems: [
      { text: 'Ajouter Paiement' },
      { text: 'Liste des Paiements' },
    ]
  },
  { 
    text: 'Groupes',
    icon: <GroupIcon />,
    subItems: [
      { text: 'Créer des groupes' },
      { text: 'Liste des groupes' },
    ]
  },
  { text: 'Gérer des choix', icon: <LayersIcon /> },
];

const statCards = [
  {
    title: 'Total Étudiants',
    value: '1,200',
    icon: <Avatar sx={{ bgcolor: '#dc3545' }}><SchoolIcon /></Avatar>,
  },
  {
    title: 'Groupes',
    value: '4',
    icon: <Avatar sx={{ bgcolor: '#F7C015' }}><GroupIcon /></Avatar>,
  },
  {
    title: 'Paiements ce mois',
    value: '350',
    icon: <Avatar sx={{ bgcolor: '#dc3545' }}><MonetizationOnIcon /></Avatar>,
  },
  {
    title: 'Paiements en attente',
    value: '8',
    icon: <Avatar sx={{ bgcolor: '#F7C015' }}><WarningAmberIcon /></Avatar>,
  },
];

export default function AdminDashboard() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [selectedMenu, setSelectedMenu] = React.useState('Dashboard');
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const [ordersMenuAnchor, setOrdersMenuAnchor] = React.useState(null);
  const open = Boolean(anchorEl);
  const auth = getAuth(app);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        } else {
          // If no stored info, create from Firebase user
          setUserInfo({
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            uid: user.uid
          });
        }
        setIsLoading(false);
      } else {
        // User is not signed in, redirect to home
        localStorage.removeItem('userInfo');
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userInfo');
      setUserInfo(null);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading or redirect if not authenticated
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Chargement...</Typography>
      </Box>
    );
  }

  if (!userInfo) {
    return null; // Will redirect to home
  }

  // Sidebar item font style
  const sidebarItemFont = {
    fontFamily: 'inherit',
    fontWeight: 400,
    fontSize: '1.1rem',
    letterSpacing: 0.2,
    textAlign: 'left',
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        background: '#fff',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.07)',
        color: '#1c2526'
      }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo and toggle button on the left */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={toggleSidebar}
              sx={{ mr: 2, color: '#1c2526' }}
            >
              {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <img src={logo} alt="Logo" style={{ height: 60, marginRight: 16, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }} />
          </Box>
          {/* Profile on the right */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {userInfo && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mr: 1,
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}>
                <VscAccount style={{ marginRight: 8, fontSize: '1.1rem', color: '#1c2526' }} />
                <Typography variant="body2" sx={{ color: '#1c2526', fontWeight: 300, fontSize: '1.1rem' }}>
                  {userInfo.displayName}
                </Typography>
              </Box>
            )}
            <Tooltip title="Account settings">
              <IconButton onClick={handleMenu} size="large" sx={{ ml: 2 }}>
                <TfiSettings style={{ color: '#1c2526', fontSize: '1.2rem' }} />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  mt: 1.5,
                  minWidth: 160,
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem>
                <VscAccount style={{ fontSize: '1rem', marginRight: 8 }}  /> Profile
              </MenuItem>
              <MenuItem>
                <TfiSettings style={{ fontSize: '1rem', marginRight: 8 }} /> System 
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <GoSignOut style={{ fontSize: '1rem', marginRight: 8 }} /> Déconnexion
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: sidebarOpen ? drawerWidth : collapsedDrawerWidth, 
            boxSizing: 'border-box', 
            background: '#000', 
            color: '#fff',
            borderRight: '2px solid #dc3545',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', flex: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
          <List>
            {navItems.map((item) => (
              <React.Fragment key={item.text}>
                <ListItem 
                  button 
                  onClick={(e) => {
                    if (item.text === 'Inscription' || item.text === 'Paiement' || item.text === 'Groupes') {
                      if (sidebarOpen) {
                        setOpenDropdown((open) => open === item.text ? null : item.text);
                      } else {
                        setOpenDropdown(item.text);
                        setOrdersMenuAnchor(e.currentTarget);
                      }
                    } else {
                      setSelectedMenu(item.text);
                      setOpenDropdown(null);
                    }
                  }}
                  sx={{
                    '&:hover': {
                      background: '#333',
                      color: '#fff'
                    },
                    minHeight: 48,
                    justifyContent: sidebarOpen ? 'space-between' : 'center',
                    px: sidebarOpen ? 3 : 2,
                    background: selectedMenu === item.text ? '#222' : 'inherit',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ListItemIcon sx={{ 
                      color: 'inherit',
                      minWidth: sidebarOpen ? 40 : 'auto'
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && <ListItemText primary={item.text} />}
                  </Box>
                  {sidebarOpen && (
                    <Typography sx={{ color: 'inherit', fontSize: 18, fontWeight: 'bold' }}>
                      <IoIosArrowForward style={{ transform: (item.text === 'Inscription' || item.text === 'Paiement' || item.text === 'Groupes') && openDropdown === item.text ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                    </Typography>
                  )}
                </ListItem>
                {/* Dropdown for Inscription, Paiement, or Groupes (expanded sidebar) */}
                {(item.text === 'Inscription' || item.text === 'Paiement' || item.text === 'Groupes') && openDropdown === item.text && sidebarOpen && (
                  <List component="div" disablePadding>
                    {item.subItems.map((sub) => (
                      <ListItem
                        key={sub.text}
                        onClick={() => {
                          setSelectedMenu(sub.text);
                          setOpenDropdown(null);
                        }}
                        sx={{
                          pl: 7,
                          background: selectedMenu === sub.text ? '#333' : 'inherit',
                          color: selectedMenu === sub.text ? '#fff' : 'inherit',
                          '&:hover': {
                            background: '#444',
                            color: '#fff'
                          },
                        }}
                      >
                        <ListItemText primary={sub.text} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </React.Fragment>
            ))}
          </List>
          {/* Inscription/Paiement dropdown as floating menu when sidebar is collapsed */}
          <Menu
            anchorEl={ordersMenuAnchor}
            open={Boolean(ordersMenuAnchor)}
            onClose={() => setOrdersMenuAnchor(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            PaperProps={{
              sx: {
                background: '#222',
                color: '#fff',
                mt: 1,
                minWidth: 180,
              },
            }}
          >
            {navItems.find((item) => item.text === openDropdown)?.subItems?.map((sub) => (
              <MenuItem
                key={sub.text}
                onClick={() => {
                  setSelectedMenu(sub.text);
                  setOrdersMenuAnchor(null);
                }}
                sx={{
                  background: selectedMenu === sub.text ? '#333' : 'inherit',
                  color: selectedMenu === sub.text ? '#fff' : 'inherit',
                  '&:hover': {
                    background: '#444',
                    color: '#fff',
                  },
                }}
              >
                {sub.text}
              </MenuItem>
            ))}
          </Menu>
        </Box>
        {/* Logout button at the bottom */}
        <Box sx={{ p: 2, borderTop: '1px solid #222', width: '100%' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              background: 'none',
              border: 'none',
              color: '#fff',
              ...sidebarItemFont,
              padding: sidebarOpen ? '10px 16px' : '10px 0',
              cursor: 'pointer',
              borderRadius: 8,
              transition: 'background 0.2s',
            }}
          >
            <FaSignOutAlt style={{ fontSize: '1.3rem', marginRight: sidebarOpen ? 12 : 0 }} />
            {sidebarOpen && 'Déconnexion'}
          </button>
        </Box>
      </Drawer>
      <Main open={sidebarOpen}>
        <Toolbar />
        {/* Main content conditional rendering */}
        {selectedMenu === 'Dashboard' && (
          <Dashboard statCards={statCards} />
        )}
        {selectedMenu === 'Ajouter Etudiants' && (
          <AddStudentForm onCancel={() => setSelectedMenu('Dashboard')} />
        )}
        {selectedMenu === 'Liste des Etudiants' && (
          <StudentList />
        )}
        {selectedMenu === 'Ajouter Paiement' && (
          <AddPayment onCancel={() => setSelectedMenu('Dashboard')} />
        )}
        {selectedMenu === 'Liste des Paiements' && (
          <PaymentList />
        )}
        {selectedMenu === 'Gérer des choix' && (
          <GererChoix />
        )}
        {selectedMenu === 'Créer des groupes' && (
          <CreerGroupe onCancel={() => setSelectedMenu('Dashboard')} />
        )}
        {selectedMenu === 'Liste des groupes' && (
          <ListGroupe />
        )}
        {/* Add more dashboard content here */}
      </Main>
    </Box>
  );
}
