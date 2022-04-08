import { Component, Input } from '@angular/core';

import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';

@Component({
  selector: 'app-account-group-list',
  templateUrl: './account-group-list.component.html',
  styleUrls: ['./account-group-list.component.scss']
})
export class AccountGroupListComponent {

  @Input() accountGroupDtos: AccountGroupDto[] = [];

  public currentPage: number = 1;
  public elementIndex: number = 0;
  public itemsPerPage: number = 25;
  public pageSize: number = 0;

  constructor() {
    console.log("AccountGroupListComponent constructor çalıştı.");
  }

  // Paginator'daki değişiklikleri tabloya uygular.
  onPageChange(currentPage: number): void {
    this.pageSize = this.itemsPerPage * (currentPage - 1);
    if(currentPage == 1){
      this.elementIndex = 0;
    } else {
      this.elementIndex = (currentPage - 1) * this.itemsPerPage;
    }
  }
}
