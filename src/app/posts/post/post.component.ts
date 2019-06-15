import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  isEditPage = false;
  post: Post;
  isLoading = false;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (!paramMap.has('postId')) {
        return;
      }

      const postId = paramMap.get('postId');
      this.isEditPage = !!postId;

      if (!this.isEditPage) {
        return;
      }

      this.postsService.getPost(postId)
        .subscribe((post: Post) => {
          this.post = post;
          this.isLoading = false;
        });
    });
  }

  onSavePost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }

    this.isLoading = true;

    const {title, content} = postForm.value;

    if (this.isEditPage) {
      const data = {
        ...this.post,
        title,
        content
      };
      this.postsService.updatePost(data);
    } else {
      this.postsService.addPost(title, content);
      postForm.resetForm();
    }
    this.router.navigate(['/']);
  }
}
