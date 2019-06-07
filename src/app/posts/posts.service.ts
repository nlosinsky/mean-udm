import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new BehaviorSubject<Post[]>([]);

  constructor() {}

  getPosts() {
    return this.postsUpdated.asObservable();
  }

  addPost(title, content) {
    const post = {title, content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
