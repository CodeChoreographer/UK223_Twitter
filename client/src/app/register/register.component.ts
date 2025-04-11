import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class RegisterComponent {
  username = ''
  password = ''

  constructor(
    private http: HttpClient,
    private router: Router,
    private notify: NotificationService
  ) {}

  onSubmit() {
    const body = { username: this.username, password: this.password };

    this.http.post('/api/users/register', body).subscribe({
      next: () => {
        this.notify.success('Erfolgreich registriert!');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.notify.error(err.error?.message || 'Fehler bei der Registrierung.');
      }
    });
  }
}
