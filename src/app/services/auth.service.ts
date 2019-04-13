import { Injectable } from '@angular/core';

import { Router } from "@angular/router";
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { User } from "firebase";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  authState: any = null;
  user: User;

  constructor( 
    public afAuth: AngularFireAuth, 
    public router: Router) { 

      this.afAuth.authState.subscribe(user => {
        if(user) {
          this.user = user;
          localStorage.setItem('user', JSON.stringify(this.user));
        } else {
          localStorage.setItem('user', null);
        }
      })

  }

  async loginWithEmail(email: string, password: string) {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(user => {
        this.authState = user;
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.log(error);
        throw error;
      });
  }

  async sendEmailVerification() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
    this.router.navigate(['/verify-email']);
  }

  async signUpWithEmail(email: string, password: string) {
    return await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        this.authState = user;
        this.sendEmailVerification();
      })
      .catch(error => {
        console.log(error);
        this.router.navigate(['']);
        throw error;
      });
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(reset => {
        this.router.navigate(['/home']);
      })
      .catch(error => {
        console.log(error);
        this.router.navigate(['']);
        throw error;
      });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
  }

  async loginWithGoogle() {
    await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    this.router.navigate(['/home']);
  }

  async loginWithFacebook() {
    await this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
    this.router.navigate(['/home']);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
