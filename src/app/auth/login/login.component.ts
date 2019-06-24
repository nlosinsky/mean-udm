import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  isLoading = false;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const {email, password} = form.value;

    this.isLoading = true;
    this.authService.login({email, password})
      .pipe(finalize(() => this.isLoading = false))
      .subscribe();
  }
}
