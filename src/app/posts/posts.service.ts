import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map(({posts}) => {
        return posts.map(post => {
          const {_id, ...rest} = post;
          return {id: _id, ...rest};
        });
      }))
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next(posts);
      });
  }

  addPost(title, content) {
    const post = {title, content};
    this.http.post('http://localhost:3000/api/posts', post)
      .pipe(map((item: any) => {
        const {_id, ...rest} = item.post;
        return {id: _id, ...rest};
      }))
      .subscribe((resp: any) => {
        this.posts.push(resp);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(id) {
    this.http.delete(`http://localhost:3000/api/posts/${id}`)
      .subscribe(() => {
        console.log('deleted');
        this.posts = this.posts.filter(post => post.id !== id);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
