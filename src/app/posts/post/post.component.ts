import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  isEditPage = false;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.initForm();
    this.handleParams();
  }

  private handleParams() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (!paramMap.has('postId')) {
        this.isLoading = false;
        return;
      }

      const postId = paramMap.get('postId');
      this.isEditPage = !!postId;

      if (!this.isEditPage) {
        return;
      }

      this.postsService.getPost(postId)
        .subscribe((post: Post) => {
          this.setForm(post);
          this.post = post;
          this.isLoading = false;
        });
    });
  }

  private initForm() {
    const config = {
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: [null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }]
    };

    this.form = this.fb.group(config);
  }

  private setForm(data) {
    const {title, content, imagePath = null} = data;

    if (imagePath) {
      this.imagePreview = imagePath;
    }

    this.form.setValue({title, content, image: imagePath});
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    const {title, content, image} = this.form.value;

    if (this.isEditPage) {
      const data = {
        ...this.post,
        title,
        content,
        image
      };
      this.postsService.updatePost(data);
    } else {
      const data = {
        title,
        content,
        image
      };
      this.postsService.addPost(data);
      this.form.reset();
    }
    this.router.navigate(['/']);
  }

  onImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.get('image').setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
