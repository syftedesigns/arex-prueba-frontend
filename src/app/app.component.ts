import { Component, OnInit } from '@angular/core';
import { ObjectDealClass } from './classes/deals.class';
import { DbService } from './services/db/db.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { GlobalService } from './services/global/global.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'arexTest';
  // ArrayDeals
  ArrayDeals: ObjectDealClass[] = []; // All data from DB
  FilteringData: ObjectDealClass[] = []; // Paginator
  dataSource = new MatTableDataSource<ObjectDealClass>(); // Table Data
  displayedColumns: string[] = ['id', 'name', 'address', 'price', 'type', 'dueDate', 'action']; // Table columns
  /*
  Sort filters
  */
  PaginatorBlock: boolean = false; // If the result if < 5 block the paginator arrow
  isOrderSelected: boolean = false; // Identify if the customer has been clicked Asc or desc sort table
  SortType: string = ''; // Input to verify if is asc or desc order
  FiltersXHR: any = undefined; // Object for save the filters config
  constructor(private db: DbService, private global: GlobalService) {}

  async ngOnInit() {
    // const DEALS_DATA: ObjectDealClass[] = await this.ReadJSONDataFile();
    this.ArrayDeals = await this.ReadJSONDataFile();
    this.SortTablePerItems(0); // First 5 fields on the table
    console.log(this.ArrayDeals);
  }

  /*
  Get Deals.json Data
  */
  ReadJSONDataFile(): Promise<ObjectDealClass[]> {
    return new Promise((resolve, reject) => {
      this.db.readJSONDATA().subscribe(
        (dataJSON) => {
          resolve(dataJSON);
        }
      );
    });
  }
  // Sort the table with a pagination
  SortTablePerItems(index: number) {
    let count = 0;
    const iterator = new Array();
    switch (index) {
      case 0:
          for (const sort of this.ArrayDeals) {
            count++;
            if (count <= 5) {
              iterator.push(sort);
            }
          }
          this.dataSource.data = iterator;
          break;
        case 1:
          for (const sort of this.ArrayDeals) {
            count++;
            if (count >= 6 && count <= 10) {
              iterator.push(sort);
            }
          }
          this.dataSource.data = iterator;
          break;
          case 2:
            for (const sort of this.ArrayDeals) {
              count++;
              if (count >= 10 && count <= 14) {
                iterator.push(sort);
              }
            }
            this.dataSource.data = iterator;
            break;
    }
  }

  Paginator(event: any): void {
    // Clear current data
    this.dataSource.data = [];
    this.SortTablePerItems(event.pageIndex);
  }



  async SorteringType(eventType: string) {
    // Compare the DealType on the Array
    // Check if the customer has manipulated the filter form
    if (this.FiltersXHR !== undefined) {
      this.ApplyAllFilters(this.FiltersXHR, eventType);
      return;
    } else {
      this.ArrayDeals = await this.ReadJSONDataFile();
      console.log('Not filtering');
    }
    const ArrayFiltered = new Array();
    let iterator = 0; // Count items
    for (const dealType of this.ArrayDeals) {
      if (dealType.type === eventType) {
        ArrayFiltered.push(dealType);
        iterator++;
      }
    }
    // Block paginator if the result is < 5
    if (iterator <= 5) {
      this.PaginatorBlock = true;
    } else {
      this.PaginatorBlock = false;
    }
    this.ArrayDeals = ArrayFiltered;
    this.SortTablePerItems(0);
  }

  // Sortering by Price or Date
  SorteringByTask(event: any = this.FiltersXHR.orderByKey) {
    switch (event.value) {
      case 'price':
        if (this.isOrderSelected) {
         if (this.SortType === 'asc') {
          // foreach Array Deals
          // tslint:disable-next-line:only-arrow-functions
          this.ArrayDeals.sort(function(a, b) {
            return a.price - b.price;
          });
          this.SortTablePerItems(0);
        } else {
          // tslint:disable-next-line:only-arrow-functions
          this.ArrayDeals.sort(function(a, b) {
            return b.price - a.price;
          });
          this.SortTablePerItems(0);
        }
      }
        break;
        case 'date':
         if (this.isOrderSelected) {
          if (this.SortType === 'asc') {
            // foreach Array Deals
            // tslint:disable-next-line:only-arrow-functions
            this.ArrayDeals.sort(function(a, b) {
              return Number(new Date(a.dueDate)) - Number(new Date(b.dueDate));
            });
            this.SortTablePerItems(0);
          } else {
            // tslint:disable-next-line:only-arrow-functions
            this.ArrayDeals.sort(function(a, b) {
              return Number(new Date(b.dueDate)) - Number(new Date(a.dueDate));
            });
            this.SortTablePerItems(0);
          }
      }
         break;
    }
    this.FiltersXHR = {
      orderTable: this.SortType,
      orderByKey: event.value
    };
  }
  // Function for apply all filter data and display a new table
  async ApplyAllFilters(Filters: any, actionSort: string) {
    if (Filters.orderTable === 'asc' && Filters.orderByKey === 'price') {
      this.ArrayDeals = await this.ReadJSONDataFile();
      // tslint:disable-next-line:only-arrow-functions
      this.ArrayDeals.sort(function(a, b) {
        return a.price - b.price;
      });
      const ArrayBuilded = new Array();
      let iterator = 0;
      for (const dealType of this.ArrayDeals) {
        if (dealType.type === actionSort) {
          ArrayBuilded.push(dealType);
          iterator++;
        }
      }
      if (iterator <= 5) {
        this.PaginatorBlock = true;
      } else {
        this.PaginatorBlock = false;
      }
      this.ArrayDeals = ArrayBuilded;
      this.SortTablePerItems(0);
    } else {
      if (Filters.orderTable === 'asc' && Filters.orderByKey === 'date') {
        this.ArrayDeals = await this.ReadJSONDataFile();
        // tslint:disable-next-line:only-arrow-functions
        this.ArrayDeals.sort(function(a, b) {
          return Number(new Date(a.dueDate)) - Number(new Date(b.dueDate));
        });
        const ArrayBuilded = new Array();
        let iterator = 0;
        for (const dealType of this.ArrayDeals) {
          if (dealType.type === actionSort) {
            ArrayBuilded.push(dealType);
            iterator++;
          }
        }
        if (iterator <= 5) {
          this.PaginatorBlock = true;
        } else {
          this.PaginatorBlock = false;
        }
        this.ArrayDeals = ArrayBuilded;
        this.SortTablePerItems(0);
      } else {
        if (Filters.orderTable === 'desc' && Filters.orderByKey === 'price') {
          this.ArrayDeals = await this.ReadJSONDataFile();
          // tslint:disable-next-line:only-arrow-functions
          this.ArrayDeals.sort(function(a, b) {
            return b.price - a.price;
          });
          const ArrayBuilded = new Array();
          let iterator = 0;
          for (const dealType of this.ArrayDeals) {
            if (dealType.type === actionSort) {
              ArrayBuilded.push(dealType);
              iterator++;
            }
          }
          if (iterator <= 5) {
            this.PaginatorBlock = true;
          } else {
            this.PaginatorBlock = false;
          }
          this.ArrayDeals = ArrayBuilded;
          this.SortTablePerItems(0);
      } else {
        if (Filters.orderTable === 'desc' && Filters.orderByKey === 'date') {
          this.ArrayDeals = await this.ReadJSONDataFile();
          // tslint:disable-next-line:only-arrow-functions
          this.ArrayDeals.sort(function(a, b) {
            return Number(new Date(b.dueDate)) - Number(new Date(a.dueDate));
          });
          const ArrayBuilded = new Array();
          let iterator = 0;
          for (const dealType of this.ArrayDeals) {
            if (dealType.type === actionSort) {
              ArrayBuilded.push(dealType);
              iterator++;
            }
          }
          if (iterator <= 5) {
            this.PaginatorBlock = true;
          } else {
            this.PaginatorBlock = false;
          }
          this.ArrayDeals = ArrayBuilded;
          this.SortTablePerItems(0);
        }
      }
     }
    }
  }
  // search bar
  async FindBySearchBar(valueData: string) {
    if (valueData !== null) {
      const ArrayFinder = new Array();
      for (const dealName of this.ArrayDeals) {
        const regex = new RegExp(`.+?(?=${valueData.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'i');
        const matches = regex.exec(dealName.name);
        if (matches !== null) {
          if (dealName.name === matches.input) {
            ArrayFinder.push(dealName);
          }
        }
      }
      this.ArrayDeals = ArrayFinder;
      this.SortTablePerItems(0);
    } else {
      this.ArrayDeals = await this.ReadJSONDataFile();
      this.SortTablePerItems(0);
      return;
    }
  }
  // Add deal to favorite
  CreateFavoriteItem(DealItem: ObjectDealClass) {
    if (this.db.SaveDealItem(DealItem)) {
      this.db.LoadFavorites();
      this.global.OpenSnackBar(`The Deal ${DealItem.name} has been added on your favorite list`);
    }
  }
  /*
  Functions Array Sorts
  */
 numberAs(a, b) {
   return a - b;
 }
}
