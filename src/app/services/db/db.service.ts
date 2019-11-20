import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { MatSnackBar } from '@angular/material';
import { ObjectDealClass } from '../../classes/deals.class';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private fileJson = './assets/db/deals.json';
  public FavoriteDeals: ObjectDealClass[] = [];
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    this.LoadFavorites();
  }

  readJSONDATA() {
    return this.http.get(this.fileJson).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError( (err: any)  => {
        console.error(err);
        this.snackBar.open('Ops! We have problems to process your data. Please try again', null, {
          duration: 5000,
          panelClass: ['red-snackbar']
        });
        return new Observable<string | boolean>();
      })
    );
  }
  // Save item to favorite
  SaveDealItem(ObjectDeal: ObjectDealClass): boolean {
    if (localStorage.getItem('db_favorite') !== undefined
    && (localStorage.getItem('db_favorite') !== null)) {
      const storage: ObjectDealClass[] = JSON.parse(localStorage.getItem('db_favorite'));
      storage.push(ObjectDeal);
      localStorage.setItem('db_favorite', JSON.stringify(storage));
    } else {
      const Storage = new Array();
      Storage.push(ObjectDeal);
      localStorage.setItem('db_favorite', JSON.stringify(Storage));
    }
    return true;
  }

  LoadFavorites() {
    if (localStorage.getItem('db_favorite') !== undefined
    && (localStorage.getItem('db_favorite') !== null)
    && (localStorage.getItem('db_favorite') !== '')) {
      this.FavoriteDeals =  JSON.parse(localStorage.getItem('db_favorite'));
    } else {
      this.FavoriteDeals =  null;
    }
  }
}
