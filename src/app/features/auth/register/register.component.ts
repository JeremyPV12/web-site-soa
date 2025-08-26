import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [NgIf, ReactiveFormsModule]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Verificar si ya está autenticado
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  // Getters para acceder a los controles del formulario
  get username() { return this.registerForm.get('username'); }
  get name() { return this.registerForm.get('name'); }
  get last_name() { return this.registerForm.get('last_name'); }
  get password() { return this.registerForm.get('password'); }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = this.registerForm.value;

      this.authService.register(formData).subscribe({
        next: (response) => {
          this.successMessage = 'Cuenta creada exitosamente. Redirigiendo...';
          
          // Guardar token y datos del usuario
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response));
          
          // Redireccionar después de un breve delay
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al crear la cuenta';
          
          // Si el error es por usuario duplicado
          if (error.status === 400 || error.error?.message?.includes('duplicate')) {
            this.errorMessage = 'El nombre de usuario ya está en uso';
          }
        },
        complete: () => {
          // El loading se desactiva en el success o error
        }
      });
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Método para obtener el mensaje de error de un campo específico
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field?.errors && field?.touched) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} es requerido`;
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${minLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      'username': 'El usuario',
      'name': 'El nombre',
      'last_name': 'El apellido',
      'password': 'La contraseña'
    };
    return displayNames[fieldName] || fieldName;
  }
}