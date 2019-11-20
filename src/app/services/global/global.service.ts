import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor(private snackBar: MatSnackBar) { }

  OpenSnackBar(msg: string, timer = 3000): void {
    this.snackBar.open(msg, null, {
      duration: timer
    });
  }
}
