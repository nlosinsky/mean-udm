import { PostsService } from '../posts.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {
  constructor(
    private postsService: PostsService
  ) { }

  ngOnInit() { }

  onAddPost(postForm: NgForm) {
    if (postForm.valid) {
      const {title, content} = postForm.value;
      this.postsService.addPost(title, content);
      postForm.resetForm();
    }
  }
}
