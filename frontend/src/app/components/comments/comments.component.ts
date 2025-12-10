import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  @Input() articleId!: string;
  comments: any[] = [];
  newComment = '';

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    this.commentService.getComments(this.articleId).subscribe(comments => this.comments = comments);
    this.commentService.getNewComment().subscribe(comment => {
      if (comment.article === this.articleId) this.comments.push(comment);
    });
    this.commentService.getNotification().subscribe(notification => alert(notification.message));
  }

  addComment() {
    this.commentService.addComment({ content: this.newComment, article: this.articleId }).subscribe(comment => {
      this.comments.push(comment);
      this.newComment = '';
    });
  }
}