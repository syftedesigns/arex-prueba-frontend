import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DbService } from './db/db.service';
import { GlobalService } from './global/global.service';
import { AngularMaterialModule } from '../angular-material.module';


@NgModule({
  declarations: [],
  providers: [
    DbService,
    GlobalService
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AngularMaterialModule
  ]
})
export class ServicesModule { }
