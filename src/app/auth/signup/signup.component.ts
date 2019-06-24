import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'signup.component.html',
  styleUrls: ['./signup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const {email, password} = form.value;

    this.isLoading = true;
    this.authService.signup({email, password})
      .pipe(finalize(() => this.isLoading = false))
      .subscribe();
  }
}
