import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModule, routedComponents } from './auth-routing.module';

@NgModule({
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    AuthRoutingModule
  ],
  exports: [],
  declarations: [
    ...routedComponents
  ],
  providers: [],
})
export class AuthModule {
}
