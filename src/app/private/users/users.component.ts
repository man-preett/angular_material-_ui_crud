import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import type { ColDef, GridOptions } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { themeQuartz } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { MyProfile } from '../../interfaces/auth';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-users',
  imports: [AgGridAngular],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}
  userList: MyProfile[] = [];
  colDefs: ColDef[] = [
    { field: 'user_first_name', headerName: 'First Name' },
    { field: 'user_last_name', headerName: 'Last Name' },
    { field: 'user_gender', headerName: 'Gender' },
    { field: 'user_email', headerName: 'Email' },
    { field: 'user_role.id', headerName: 'Role Id ' },
    { field: 'user_country', headerName: 'Country' },
    { field: 'user_state', headerName: 'State' },
    { field: 'user_city', headerName: 'City' },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    filter: true,
  };
  gridOptions: GridOptions = {
    columnDefs: this.colDefs,
    defaultColDef: this.defaultColDef,
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [5, 10, 20, 50, 100],
    theme: themeQuartz,
    getRowStyle: (params) => {
      const rowIndex = params?.node?.rowIndex;

      if (rowIndex != null && rowIndex % 2 === 0) {
        return { background: '#f1f1f1' };
      }
      return undefined;
    },
  };
  ngOnInit() {
    this.userService.users().subscribe({
      next: (res) => {
        if (res.status) {
          this.userList = res.data;
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }
}

