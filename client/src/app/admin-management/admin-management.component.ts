import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-management.component.html',
})
export class AdminManagementComponent implements OnInit {
  users: any[] = []
  availableRoles = ['user', 'moderator', 'admin']
  selectedRole: { [userId: number]: string } = {}

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadUsers()
  }

  loadUsers(): void {
    this.http.get<any[]>('/api/admin/users').subscribe({
      next: (data) => (this.users = data),
      error: () => this.toastr.error('Fehler beim Laden der Benutzer'),
    })
  }

  assignRole(userId: number): void {
    const role = this.selectedRole[userId]
    if (!role) return

    this.http
      .post(`/api/admin/users/${userId}/roles`, { roleName: role })
      .subscribe({
        next: () => {
          this.toastr.success(`Rolle ${role} zugewiesen`)
          this.loadUsers()
          this.selectedRole[userId] = ''
        },
        error: () => this.toastr.error('Fehler beim Zuweisen der Rolle'),
      })
  }

  removeRole(userId: number, roleId: number): void {
    this.http.delete(`/api/admin/users/${userId}/roles/${roleId}`).subscribe({
      next: () => {
        this.toastr.success('Rolle entfernt')
        this.loadUsers()
      },
      error: () => this.toastr.error('Fehler beim Entfernen der Rolle'),
    })
  }

  toggleActive(userId: number): void {
    this.http.put(`/api/admin/users/${userId}/toggle-active`, {}).subscribe({
      next: (res: any) => {
        this.toastr.success(res.message);
        this.loadUsers();
      },
      error: () => this.toastr.error('Fehler beim Sperren/Freigeben')
    });
  }

  deleteUser(userId: number): void {
    if (!confirm('Willst du dieses Benutzerkonto wirklich löschen?')) return;

    this.http.delete(`/api/admin/users/${userId}`).subscribe({
      next: () => {
        this.toastr.success('Benutzer gelöscht');
        this.loadUsers();
      },
      error: () => this.toastr.error('Fehler beim Löschen des Benutzers')
    });
  }

}
