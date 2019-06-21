import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule, routedComponents } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatInputModule,
  MatCardModule,
  MatToolbarModule,
  MatButtonModule,
  MatExpansionModule,
  MatProgressSpinnerModule, MatPaginatorModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ...routedComponents
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    HttpClientModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
