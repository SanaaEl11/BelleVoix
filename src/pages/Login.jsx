import React, { useState } from 'react'
import logo from '../assets/logo.png'
import SignUp from './SignUp'
import {getAuth, signInWithEmailAndPassword} from "firebase/auth"
import {app}from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Login({ onCloseModal, onSwitchToSignUp }) {
  const [email,setEmail]=useState('');
  const[password,setpassword]=useState('');
  const[loginError,setLoginError]=useState('');
  const[successMessage,setSuccessMessage]=useState('');
  const auth=getAuth(app);
  
  const HandleLogin=async(e)=>{
    e.preventDefault();
    setLoginError('');
    setSuccessMessage('');
    try{
      const userCredential = await signInWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;
      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        setLoginError("Aucun rôle trouvé pour cet utilisateur.");
        return;
      }
      const userData = userDoc.data();
      if (userData.role !== 'admin') {
        setLoginError("Seuls les administrateurs peuvent accéder au tableau de bord admin.");
        return;
      }
      setSuccessMessage('Connexion réussie !');
      // Store user info in localStorage
      localStorage.setItem('userInfo', JSON.stringify({
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        uid: user.uid,
        role: userData.role
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
  
  const navigate = useNavigate();
  
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
        <p className="login-signup-switch text-center mt-3">
          Si vous n'avez pas de compte ?{' '}
          <span className="login-signup-link" onClick={onSwitchToSignUp} style={{color: '#dc3545', cursor: 'pointer', fontWeight: 600}}>Inscription</span>
        </p>
      </form>
    </div>
  )
}
