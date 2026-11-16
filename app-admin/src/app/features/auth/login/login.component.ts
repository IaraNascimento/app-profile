import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  errorMessage = "";

  async login(): Promise<void> {
    this.loading = true;
    this.errorMessage = "";

    try {
      await this.authService.loginWithGoogle();

      await this.router.navigate(["/main"]);
    } catch (error) {
      this.errorMessage = "Não foi possível realizar o login.";
      console.error(error);
    } finally {
      this.loading = false;
    }
  }
}
