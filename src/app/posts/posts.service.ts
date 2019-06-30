import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Post } from './post.model';

const BACKEND_URL = environment.apiUrl + 'posts/';

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
    return this.http.get(BACKEND_URL + id)
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

    this.http.get<{message: string, posts: any, count: number}>(BACKEND_URL, {params})
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

    return this.http.post(BACKEND_URL, postData)
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

    return this.http.put(BACKEND_URL, postData)
      .pipe(pluck('post'));
  }

  deletePost(id) {
    return this.http.delete(BACKEND_URL + id);
  }

  private transformPost(post) {
    const {_id, ...rest} = post;
    return {id: _id, ...rest};
  }
}
