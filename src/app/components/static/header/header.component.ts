import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalComponent } from '../modal/modal.component';
import { GlobalService } from '../../../services/global/global.service';
import { DbService } from '../../../services/db/db.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private dialog: MatDialog, private global: GlobalService,
              private db: DbService) { }

  ngOnInit() {
  }
  // Popup Favorites
  OpenDialogFavorites(): void {
    const dialog = this.dialog.open(ModalComponent, {
      width: '100vh',
      height: '600px',
      disableClose: false,
      autoFocus: false
    });
    // Verify if favorite list is changed
    dialog.afterClosed().subscribe(
      (data) => {
        this.db.FavoriteDeals = [];
      }
    );
  }
}
