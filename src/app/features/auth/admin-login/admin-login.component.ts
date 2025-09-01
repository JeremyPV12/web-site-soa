import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, NgIf],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;
  showPasword: boolean = false;

  private adminCredentials = {
    username: 'admin',
    password: 'admin123',
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (this.loggedIn()) {
      this.router.navigate(['/admin']);
    }
  }

  loggedIn(): boolean {
    return (
      localStorage.getItem('tokenUser') ===
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30'
    );
  }

  togglePassword(): void {
    this.showPasword = !this.showPasword;
  }

  onSubmit(form: NgForm): void {
    if (form.valid && !this.loading) {
      this.loading = true;
      this.errorMessage = '';

      setTimeout(() => {
        if (
          this.username === this.adminCredentials.username &&
          this.password === this.adminCredentials.password
        ) {
          // Guardar estado de login
          localStorage.setItem(
            'tokenUser',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30'
          );

          // Redirigir al dashboard de admin
          this.router.navigate(['/admin']);
        } else {
          this.errorMessage = 'Credenciales incorrectas. Intente nuevamente.';
          this.loading = false;
        }
      }, 1000);
    }
  }

  getUsernameError(): string {
    if (!this.username) return 'El usuario es requerido';
    if (this.username.length < 3)
      return 'El usuario debe tener al menos 3 caracteres';
    return '';
  }

  getPasswordError(): string {
    if (!this.password) return 'La contraseña es requerida';
    if (this.password.length < 6)
      return 'La contraseña debe tener al menos 6 caracteres';
    return '';
  }
}
