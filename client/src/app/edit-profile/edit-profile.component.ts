import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styles: []
})
export class EditProfileComponent {
  username = '';
  password = '';
  message = '';
  userId: number | null = null;

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.userId = decoded.userId;
        this.username = decoded.username;
      } catch {
        this.toastr.error('Fehler beim laden des Profils');
      }
    }
  }

  updateProfile() {
    if (!this.userId || !this.username || !this.password) return;

    const body = {
      userId: this.userId,
      username: this.username,
      password: this.password
    };

    this.http.put('/api/users/update', body).subscribe({
      next: () => {
        this.toastr.success('Profil wurde aktualisiert');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.toastr.error('Fehler beim Aktualisieren des Profils');
      }
    });
  }
}
