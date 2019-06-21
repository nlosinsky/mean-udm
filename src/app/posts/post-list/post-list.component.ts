import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostListComponent implements OnInit {
  posts$: Observable<Post[]>;
  postsCount$: Observable<number>;
  isLoading = false;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 0;

  constructor(
    private postsService: PostsService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.currentPage, this.postsPerPage);
    this.posts$ = this.postsService.posts$.pipe(tap(() => this.isLoading = false));
    this.postsCount$ = this.postsService.postsCount$;
  }

  onDelete(id) {
    this.isLoading = true;

    this.postsService.deletePost(id)
      .subscribe(() => {
        this.postsService.getPosts(this.currentPage, this.postsPerPage);
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex;

    this.postsService.getPosts(this.currentPage, this.postsPerPage);
  }
}
