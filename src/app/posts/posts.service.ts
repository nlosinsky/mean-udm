import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new BehaviorSubject<Post[]>([]);
  posts$: Observable<Post[]>;

  constructor(
    private http: HttpClient
  ) {
    this.posts$ = this.postsUpdated.asObservable();
  }

  getPosts() {
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
      .subscribe((resp) => {
        this.posts = resp.posts;
        this.postsUpdated.next(resp.posts);
      });
  }

  addPost(title, content) {
    const post = {title, content};
    this.http.post('http://localhost:3000/api/posts', post)
      .subscribe(() => {
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
