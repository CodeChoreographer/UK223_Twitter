import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private notify: NotificationService
  ) {}

  onSubmit() {
    const credentials = { username: this.username, password: this.password };

    this.http.post('/api/users/login', credentials).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.notify.success('Login erfolgreich!');
          this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'Login fehlgeschlagen.');
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
