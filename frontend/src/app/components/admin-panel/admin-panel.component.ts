import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
  users: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/api/users').subscribe((users: any) => this.users = users);
  }

  updateRole(id: string, role: string) {
    this.http.put(`http://localhost:3000/api/users/${id}/role`, { role }).subscribe();
  }
}