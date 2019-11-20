import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { DbService } from '../../../services/db/db.service';
import { ObjectDealClass } from '../../../classes/deals.class';
import { GlobalService } from '../../../services/global/global.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  public FavoriteList: ObjectDealClass[] = [];
  displayedColumns: string[] = ['id', 'name', 'address', 'type', 'dueDate', 'action']; // Table columns
  dataSource = new MatTableDataSource<ObjectDealClass>(); // Table Data
  IsOrder: boolean = false; // If customer is search by select input
  constructor(public dialogRef: MatDialogRef<ModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, private db: DbService,
              private global: GlobalService) {
                this.db.LoadFavorites();
              }

  ngOnInit() {
    if (this.db.FavoriteDeals !== null) {
      // Items exists
      this.FavoriteList = this.db.FavoriteDeals;
      this.dataSource.data = this.FavoriteList;
    } else {
      this.FavoriteList = null;
    }
  }

  SortFavoriteList(eventType: string): void {
    this.FavoriteList = this.db.FavoriteDeals; // Re-start data everywhere, to refresh my favorite list
    this.IsOrder = true;
    const ArrayFavoriteFiltered = new Array(); // New Array with custom favorite list ordered
    for (const DealType of this.FavoriteList) {
      if (DealType.type === eventType) {
        ArrayFavoriteFiltered.push(DealType);
      }
    }
    this.FavoriteList = ArrayFavoriteFiltered;
    this.dataSource.data = this.FavoriteList;
  }

  confirmEvent(eventCheck: boolean, index: number, DealObject: any): void {
    if (eventCheck) {
      if (!this.IsOrder) {
        this.FavoriteList.splice(index, 1); // Remove from current array
        this.dataSource.data = this.FavoriteList; // Replace the Table without refresh the page
        localStorage.removeItem('db_favorite'); // We also remove the db_array to refresh
        localStorage.setItem('db_favorite', JSON.stringify(this.FavoriteList)); // Save Again this array without the current item
        this.global.OpenSnackBar(`${DealObject.name} has been removed from your list`, 5000);
      } else {
        const NewArrayWithoutCurrentElement = new Array();
        for (const dbXHR of this.db.FavoriteDeals) {
          if (dbXHR.id !== DealObject.id) {
            NewArrayWithoutCurrentElement.push(dbXHR);
          }
        }
        this.FavoriteList = NewArrayWithoutCurrentElement;
        this.dataSource.data = this.FavoriteList;
        localStorage.removeItem('db_favorite'); // We also remove the db_array to refresh
        localStorage.setItem('db_favorite', JSON.stringify(this.FavoriteList)); // Save Again this array without the current item
        this.global.OpenSnackBar(`${DealObject.name} has been removed from your list`, 5000);
      }
    }
  }
    // search bar
    async FindBySearchBar(valueData: string) {
      if (valueData !== null) {
        if (this.IsOrder) {
          this.FavoriteList = this.db.FavoriteDeals;
        }
        const ArrayFinder = new Array();
        for (const dealName of this.FavoriteList) {
          const regex = new RegExp(`.+?(?=${valueData.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'i');
          const matches = regex.exec(dealName.name);
          if (matches !== null) {
            if (dealName.name === matches.input) {
              ArrayFinder.push(dealName);
            }
          }
        }
        this.FavoriteList = ArrayFinder;
        this.dataSource.data = this.FavoriteList;
      } else {
        this.FavoriteList = this.db.FavoriteDeals;
        this.dataSource.data = this.FavoriteList;
        return;
      }
    }
}
