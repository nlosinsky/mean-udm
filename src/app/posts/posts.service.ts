import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
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

  getPost(id: string) {
    return this.http.get('http://localhost:3000/api/posts/' + id)
      .pipe(
        pluck('post'),
        map(this.transformPost)
      );
  }

  getPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
      .pipe(map(({posts}) => {
        return posts.map(this.transformPost);
      }))
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next(posts);
      });
  }

  addPost(post) {
    const {title, content, image} = post;
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post('http://localhost:3000/api/posts', postData)
      .pipe(pluck('post'))
      .subscribe((newPost: Post) => {
        this.posts.push(newPost);
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(newPost) {
    const {title, content, image, id} = newPost;
    let postData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image
      };
    }

    this.http.put('http://localhost:3000/api/posts', postData)
      .pipe(pluck('post'))
      .subscribe((resp: Post) => {
        this.posts = this.posts.map(post => (post.id === id) ? resp : post);

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

  private transformPost(post) {
    const {_id, ...rest} = post;
    return {id: _id, ...rest};
  }
}
