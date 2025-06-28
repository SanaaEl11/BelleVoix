import React, { useState } from 'react'
import logo from '../assets/logo.png'
import { FaGoogle } from 'react-icons/fa'
import SignUp from './SignUp'
import {getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup} from "firebase/auth"
import {app}from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function Login({ onCloseModal }) {
  const [showSignUp, setShowSignUp] = useState(false)
  const[email,setEmail]=useState('');
  const[password,setpassword]=useState('');
  const[loginError,setLoginError]=useState('');
  const[successMessage,setSuccessMessage]=useState('');
  const auth=getAuth(app);
  const GoogleProvider=new GoogleAuthProvider();
  const navigate = useNavigate();
  
  if (showSignUp) {
    return <SignUp onSwitchToLogin={() => setShowSignUp(false)} />
  }
  
  const HandleLogin=async(e)=>{
    e.preventDefault();
    setLoginError('');
    setSuccessMessage('');
    try{
      const userCredential = await signInWithEmailAndPassword(auth,email,password);
      console.log("loged In");
      setSuccessMessage('Connexion réussie !');
      
      // Store user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify({
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || email.split('@')[0],
        uid: userCredential.user.uid
      }));
      
      // Close modal and navigate to admin dashboard after a short delay
      setTimeout(() => {
        if (onCloseModal) onCloseModal();
        navigate('/admin');
      }, 1500);
      
    }catch(error){
      console.log(error.code);
      setLoginError('Email ou mot de passe incorrect');
    }
  }
  
  const HandleGoogleLogin=async()=>{
    setLoginError('');
    setSuccessMessage('');
    try{
      const result = await signInWithPopup(auth,GoogleProvider);
      console.log("Google login Done");
      setSuccessMessage('Connexion avec Google réussie !');
      
      // Store user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify({
        email: result.user.email,
        displayName: result.user.displayName || result.user.email.split('@')[0],
        uid: result.user.uid
      }));
      
      // Close modal and navigate to admin dashboard after a short delay
      setTimeout(() => {
        if (onCloseModal) onCloseModal();
        navigate('/admin');
      }, 1500);
      
    }catch(error){
      console.log('Google login error:', error);
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      
      // Provide more specific error messages
      let errorMessage = 'Erreur lors de la connexion avec Google';
      
      switch(error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Connexion annulée par l\'utilisateur';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup bloqué par le navigateur. Veuillez autoriser les popups pour ce site.';
          break;
        case 'auth/unauthorized-domain':
          errorMessage = 'Domaine non autorisé. Veuillez contacter l\'administrateur.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erreur de réseau. Vérifiez votre connexion internet.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Connexion Google non activée. Veuillez contacter l\'administrateur.';
          break;
        default:
          errorMessage = `Erreur lors de la connexion avec Google: ${error.message}`;
      }
      
      setLoginError(errorMessage);
    }
  }
  
  return (
    <div className="login-modal-form-wrapper">
      <div className="login-logo-center">
        <img src={logo} alt="Logo" className="login-logo-img" />
      </div>
      <form className="login-form" onSubmit={HandleLogin}>
        {loginError && (
          <div className="alert alert-danger" role="alert">
            {loginError}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="login-email" className="form-label">Email</label>
          <input type="email"  value={email}  
            onChange={(e)=>setEmail(e.target.value)}  className="form-control" id="login-email" placeholder="Entrez votre email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="login-password" className="form-label">Mot de passe</label>
          <input type="password"  value={password}  
            onChange={(e)=>setpassword(e.target.value)}  className="form-control" id="login-password" placeholder="Entrez votre mot de passe" required />
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="rememberMe" />
          <label className="form-check-label" htmlFor="rememberMe">Se souvenir de moi</label>
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-login-modal w-100">Connexion</button>
        </div>
        <div className="login-or-separator">
          <span>ou</span>
        </div>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-google-login w-100" onClick={HandleGoogleLogin}>
            <FaGoogle style={{ marginRight: '0.5em', fontSize: '1.2em' }} /> Connecter avec Google
          </button>
        </div>
        <p className="login-signup-switch text-center mt-3">
          Si vous n'avez pas de compte ?{' '}
          <span className="login-signup-link" onClick={() => setShowSignUp(true)} style={{color: '#dc3545', cursor: 'pointer', fontWeight: 600}}>Inscription</span>
        </p>
      </form>
    </div>
  )
}
