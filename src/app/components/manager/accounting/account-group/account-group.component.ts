import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs';

import { AccountGroupDto } from 'src/app/models/dtos/account-group-dto';
import { ListDataResult } from 'src/app/models/results/list-data-result';

import { AccountGroupService } from 'src/app/services/account-group.service';

@Component({
  selector: 'app-account-group',
  templateUrl: './account-group.component.html',
  styleUrls: ['./account-group.component.scss']
})
export class AccountGroupComponent implements OnInit, OnDestroy {

  public accountGroupDtos$!: Observable<ListDataResult<AccountGroupDto>>;
  public activePage: string = "list";
  
  constructor(
    private accountGroupService: AccountGroupService,
  ) { 
    console.log("AccountGroupComponent constructor çalıştı.");

    this.accountGroupDtos$ = this.getAccountGroups();
  }

  getAccountGroups(): Observable<ListDataResult<AccountGroupDto>> {
    this.accountGroupDtos$ = this.accountGroupService.getAll();
    return this.accountGroupDtos$;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
