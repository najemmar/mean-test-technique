import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from '../../services/article.service';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit {
  article: any = { title: '', content: '', image: '', tags: '' };
  id: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private articleService: ArticleService) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.articleService.getArticle(this.id).subscribe(article => this.article = article);
    }
  }

  save() {
    const tagsArray = this.article.tags.split(',').map((t: string) => t.trim());
    const payload = { ...this.article, tags: tagsArray };

    if (this.id) {
      this.articleService.updateArticle(this.id, payload).subscribe(() => this.router.navigate(['/articles']));
    } else {
      this.articleService.createArticle(payload).subscribe(() => this.router.navigate(['/articles']));
    }
  }
}