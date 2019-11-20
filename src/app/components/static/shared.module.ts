import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ModalComponent } from './modal/modal.component';
import { FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material.module';
import { RouterModule } from '@angular/router';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    ModalComponent
  ],
  entryComponents: [
    FooterComponent,
    HeaderComponent,
    ModalComponent
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule,
    SweetAlert2Module
  ]
})
export class SharedModule { }
