import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role = '';

  constructor(private authService: AuthService, private router: Router) { }

  register() {
    this.authService.register({ username: this.username, email: this.email, password: this.password, role: this.role }).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}