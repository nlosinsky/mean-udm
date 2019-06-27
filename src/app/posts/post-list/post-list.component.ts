import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostListComponent implements OnInit, OnDestroy {
  posts$: Observable<Post[]>;
  postsCount$: Observable<number>;
  isLoading = false;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 0;

  private ngUnsubscribe = new Subject();

  constructor(
    private postsService: PostsService,
    public authService: AuthService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.loadPosts(this.currentPage, this.postsPerPage);
    this.posts$ = this.postsService.posts$.pipe(tap(() => this.isLoading = false));
    this.postsCount$ = this.postsService.postsCount$;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  onDelete(id) {
    this.isLoading = true;

    this.postsService.deletePost(id)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cd.detectChanges();
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.postsService.loadPosts(this.currentPage, this.postsPerPage);
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex;

    this.postsService.loadPosts(this.currentPage, this.postsPerPage);
  }
}
