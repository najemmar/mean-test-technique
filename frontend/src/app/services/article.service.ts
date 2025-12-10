import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private apiUrl = 'http://localhost:3000/api/articles';

  getArticles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getArticle(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createArticle(article: any): Observable<any> {
    return this.http.post(this.apiUrl, article);
  }

  updateArticle(id: string, article: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, article);
  }

  deleteArticle(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  constructor(private http: HttpClient) {}
}