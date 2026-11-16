import { Injectable, inject } from "@angular/core";
import {
  Auth,
  GoogleAuthProvider,
  authState,
  signInWithPopup,
  signOut,
} from "@angular/fire/auth";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private auth = inject(Auth);

  user$ = authState(this.auth);

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(this.auth, provider);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }
}
