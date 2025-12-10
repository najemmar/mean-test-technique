// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode @types/jwt-decode

interface JwtPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';

  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  private currentUserSubject = new BehaviorSubject<any>(null);

  // Observables publics
  public token$ = this.tokenSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Au démarrage de l'app, on décode le token s'il existe
    const token = this.getToken();
    if (token) {
      this.decodeAndSetUser(token);
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);

        this.tokenSubject.next(res.token);
        this.decodeAndSetUser(res.token);
      })
    );
  }

  register(user: { username: string; email: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.apiUrl}/refresh`, { refreshToken }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.tokenSubject.next(res.token);
        this.decodeAndSetUser(res.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  // ──────────────────────────────────────────────
  // Méthodes utilitaires pour les rôles
  // ──────────────────────────────────────────────

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload: JwtPayload = jwtDecode(token);
      return payload.exp ? payload.exp * 1000 > Date.now() : false;
    } catch {
      return false;
    }
  }

  /** Retourne le rôle actuel (Admin | Editor | Writer | Reader) */
  getRole(): string | null {
    const user = this.currentUserSubject.value;
    return user?.role || null;
  }

  /** Retourne l'ID de l'utilisateur connecté */
  getUserId(): string | null {
    const user = this.currentUserSubject.value;
    return user?.id || null;
  }

  /** Retourne l'utilisateur complet */
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    return this.getRole() === 'Admin';
  }

  isEditor(): boolean {
    return this.getRole() === 'Editor';
  }

  isWriter(): boolean {
    return this.getRole() === 'Writer';
  }

  isReader(): boolean {
    return this.getRole() === 'Reader';
  }

  /** Vérifie si l'utilisateur a un des rôles passés en paramètre */
  hasRole(allowedRoles: string[]): boolean {
    const role = this.getRole();
    return role ? allowedRoles.includes(role) : false;
  }

  /** Vérifie si l'utilisateur est le propriétaire d'une ressource */
  isOwner(resourceAuthorId: string): boolean {
    return this.getUserId() === resourceAuthorId;
  }

  // ──────────────────────────────────────────────
  // Méthode privée pour décoder le token
  // ──────────────────────────────────────────────
  private decodeAndSetUser(token: string): void {
    try {
      const payload: JwtPayload = jwtDecode(token);
      this.currentUserSubject.next({
        id: payload.id,
        username: payload.username,
        email: payload.email,
        role: payload.role
      });
    } catch (error) {
      console.error('Erreur décodage JWT', error);
      this.logout();
    }
  }
}