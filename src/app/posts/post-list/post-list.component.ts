import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts$: Observable<Post[]>;

  constructor(
    private postsService: PostsService
  ) { }

  ngOnInit() {
    this.posts$ = this.postsService.getPosts();
  }
}
