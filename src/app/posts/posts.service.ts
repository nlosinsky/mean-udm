import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private postsUpdated = new BehaviorSubject<Post[]>([]);
  private postsCount = new BehaviorSubject<number>(0);
  posts$: Observable<Post[]>;
  postsCount$: Observable<number>;

  constructor(
    private http: HttpClient
  ) {
    this.posts$ = this.postsUpdated.asObservable();
    this.postsCount$ = this.postsCount.asObservable();
  }

  getPost(id: string) {
    return this.http.get('http://localhost:3000/api/posts/' + id)
      .pipe(
        pluck('post'),
        map(this.transformPost)
      );
  }

  loadPosts(page: number, pageSize: number) {
    const params = new HttpParams({fromObject: {
      page: page.toString(),
      pageSize: pageSize.toString()
    }});

    this.http.get<{message: string, posts: any, count: number}>('http://localhost:3000/api/posts', {params})
      .pipe(map(({posts, count}) => {
        return {
          posts: posts.map(this.transformPost),
          count
        };
      }))
      .subscribe(({posts, count}) => {
        this.postsUpdated.next(posts);
        this.postsCount.next(count);
      });
  }

  addPost(post) {
    const {title, content, image} = post;
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    return this.http.post('http://localhost:3000/api/posts', postData)
      .pipe(pluck('post'));
  }

  updatePost(newPost) {
    const {title, content, image, id, creator} = newPost;
    console.log(creator);
    let postData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('creator', creator);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        creator,
        imagePath: image
      };
    }

    return this.http.put('http://localhost:3000/api/posts', postData)
      .pipe(pluck('post'));
  }

  deletePost(id) {
    return this.http.delete(`http://localhost:3000/api/posts/${id}`);
  }

  private transformPost(post) {
    const {_id, ...rest} = post;
    return {id: _id, ...rest};
  }
}
