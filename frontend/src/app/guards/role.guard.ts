import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {jwtDecode} from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.authService.getToken();
    if (!token) return false;

    const decoded: any = jwtDecode(token);
    const allowedRoles = route.data['roles'] as string[];
    if (allowedRoles.includes(decoded.role)) return true;

    this.router.navigate(['/articles']);
    return false;
  }
}