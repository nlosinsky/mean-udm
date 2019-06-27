import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostComponent implements OnInit, OnDestroy {
  isEditPage = false;
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  private ngUnsubscribe = new Subject();

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.initForm();
    this.handleParams();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((post: Post) => {
          this.setForm(post);
          this.post = post;
          this.isLoading = false;
          this.cd.detectChanges();
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
    let data = {title, content, image};

    data = this.isEditPage ? {...this.post, ...data} : data;

    const observable = this.isEditPage ? this.updatePost(data) : this.addPost(data);

    observable
      .pipe(
        takeUntil(this.ngUnsubscribe),
        finalize(() => {
          this.isLoading = false;
          this.cd.detectChanges();
        })
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  private updatePost(data) {
    return this.postsService.updatePost(data);
  }

  private addPost(data) {
    return this.postsService.addPost(data)
      .pipe(
        tap(() => this.form.reset())
      );
  }

  onImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.get('image').setValue(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.cd.detectChanges();
    };
    reader.readAsDataURL(file);
  }
}
