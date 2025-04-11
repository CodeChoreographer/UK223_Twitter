import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode'

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<any>('/api/users/login', { username, password }).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/']);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.userId ?? null;
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const decoded: any = jwtDecode(token);
    return decoded.username ?? null;
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const decoded: any = jwtDecode(token);
    return decoded.roles || [];
  }
}
