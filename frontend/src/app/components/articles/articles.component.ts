import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Add for navigation
import { AuthService } from 'src/app/services/auth.service';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  articles: any[] = [];

  constructor(private articleService: ArticleService, public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.articleService.getArticles().subscribe(articles => this.articles = articles);
  }

  view(id: string) {
    this.router.navigate(['/articles', id]);
  }

  edit(id: string) {
    this.router.navigate(['/articles', id, 'edit']);
  }

  delete(id: string) {
    if (this.authService.getRole() !== 'Admin') return;
    this.articleService.deleteArticle(id).subscribe(() => {
      this.articles = this.articles.filter(a => a._id !== id);
    });
  }

}