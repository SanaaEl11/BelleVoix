/* eslint-disable no-unused-vars */
import React from 'react'
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth"
import {useState} from 'react';
import {app}from '../firebase';

export default function SignUp({ onSwitchToLogin }) {
  const[email,setEmail]=useState('');
  const[password,setpassword]=useState('');
  const[confirmPassword,setConfirmPassword]=useState('');
  const[firstname,setFirstname]=useState('');
  const[lastname,setLastname]=useState('');
  const[loginError,setLoginError]=useState('');
  const[successMessage,setSuccessMessage]=useState('');
  const auth=getAuth(app);
  
  const HandleSign=async(e)=>{
    e.preventDefault();
    setLoginError('');
    setSuccessMessage('');
    
    // Validate passwords match
    if(password !== confirmPassword) {
      setLoginError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Validate password length
    if(password.length < 6) {
      setLoginError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    try{
      await createUserWithEmailAndPassword(auth,email,password);
      console.log("SignUp successful");
      setSuccessMessage(' Votre compte a été créé avec succès.');
      // Clear form fields after successful signup
      setEmail('');
      setpassword('');
      setConfirmPassword('');
      setFirstname('');
      setLastname('');
    }
    catch(error){
      console.log(error);
      setLoginError(error.message);
    }
  }

  
  return (
    <div className="signup-modal-form-wrapper">
      <form className="signup-form" onSubmit={HandleSign}>
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
        <div className="row">
          <div className="col mb-3">
            <label htmlFor="signup-firstname" className="form-label">Prénom</label>
            <input 
              type="text" 
              className="form-control" 
              id="signup-firstname" 
              placeholder="Votre prénom" 
              value={firstname}
              onChange={(e)=>setFirstname(e.target.value)}
              required 
            />
          </div>
          <div className="col mb-3">
            <label htmlFor="signup-lastname" className="form-label">Nom</label>
            <input 
              type="text" 
              className="form-control" 
              id="signup-lastname" 
              placeholder="Votre nom" 
              value={lastname}
              onChange={(e)=>setLastname(e.target.value)}
              required 
            />
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="signup-email" className="form-label">Email</label>
          <input 
            type="email"  
            value={email}  
            onChange={(e)=>setEmail(e.target.value)} 
            className="form-control" 
            id="signup-email" 
            placeholder="Votre email" 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="signup-password" className="form-label">Mot de passe</label>
          <input 
            type="password" 
            value={password}  
            onChange={(e)=>setpassword(e.target.value)} 
            className="form-control" 
            id="signup-password" 
            placeholder="Mot de passe" 
            required 
          />
        </div>
        <div className="mb-3">
          <label htmlFor="signup-confirm-password" className="form-label">Confirmer le mot de passe</label>
          <input 
            type="password"  
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            className="form-control" 
            id="signup-confirm-password" 
            placeholder="Confirmez le mot de passe" 
            required 
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-login-modal w-100">Créer un compte</button>
        </div>
        <p className="login-signup-switch text-center mt-3">
          Si vous avez déjà un compte ?{' '}
          <span className="login-signup-link" onClick={onSwitchToLogin} style={{color: '#dc3545', cursor: 'pointer', fontWeight: 600}}> Connexion</span>
        </p>
      </form>
    </div>
  )
}
