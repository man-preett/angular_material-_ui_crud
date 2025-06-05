import { Component, NgZone, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import {
  ColDef,
  GridOptions,
  GridReadyEvent,
  themeQuartz,
  GridApi,
  IDatasource,
  IGetRowsParams,
  InfiniteRowModelModule,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ModuleRegistry,
  ITextFilterParams,
} from 'ag-grid-community';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CustomInnerHeader } from '../customHeader';
ModuleRegistry.registerModules([InfiniteRowModelModule]);
@Component({
  selector: 'app-projects',
  imports: [AgGridAngular, FormsModule, NgClass, MatIconModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  openSidebar = false;

  columnToggleList: { field: string; headerName: string; visible: boolean }[] =
    [];
  projectList: any[] = [];
  gridApiActive: GridApi | null = null;
  filterModel: any = {};
  sortModel: any[] = [];
  colDefs: ColDef[] = [
    // {
    //   headerName: 'Sr no.',
    //   pinned: 'left',
    //   headerClass: 'bold-header',
    //   width: 100,
    //   field: 'srno_',
    //   cellStyle: { borderRight: '2px solid #a7a7a7' },
    //   cellRenderer: function (params: any) {
    //     return params?.node?.rowIndex + 1;
    //   },
    // },
    {
      field: 'project_name',
      headerName: 'Project Name',
      headerClass: 'bold-header',
    },
    {
      field: 'project_description',
      tooltipField: 'project_description',
      headerName: 'Project description',
      headerClass: 'bold-header',
    },
    {
      field: 'project_tech',
      headerName: 'Project Tech',
      headerClass: 'bold-header',
    },
    {
      field: 'project_status',
      headerName: ' Project status ',
      headerClass: 'bold-header',
    },
    {
      field: 'project_lead',
      headerName: 'Project lead',
      headerClass: 'bold-header',
    },
    {
      field: 'project_manager',
      headerName: 'Project manager',
      headerClass: 'bold-header',
    },
    {
      field: 'project_client',
      headerName: 'Project client',
      headerClass: 'bold-header',
    },
    {
      field: 'management_tool',
      headerName: 'Management tool',
      headerClass: 'bold-header',
    },
    {
      field: 'management_url',
      tooltipField: 'management_url',
      headerName: 'Manangement url',
      headerClass: 'bold-header',
    },
    { field: 'repo_tool', headerName: 'Repo tool', headerClass: 'bold-header' },
    {
      field: 'repo_url',
      tooltipField: 'repo_url',
      headerName: 'Repo url',
      headerClass: 'bold-header',
    },
    {
      field: 'project_startDate',
      headerName: 'Project start date',
      headerClass: 'bold-header',
    },
    {
      field: 'project_deadlineDate',
      headerName: 'Project deadline date',
      headerClass: 'bold-header',
    },
    {
      field: 'project_budget',
      headerName: 'Project budget',
      headerClass: 'bold-header',
    },
    {
      field: 'project_priority',
      headerName: 'Project priority',
      headerClass: 'bold-header',
    },
    {
      field: 'project_location',
      headerName: 'Project location',
      headerClass: 'bold-header',
    },
    {
      field: 'project_type',
      tooltipField: 'project_type',
      headerName: 'Project Type',
      headerClass: 'bold-header',
    },
    {
      field: 'project_approval_status',
      headerName: 'Project approve status',
      headerClass: 'bold-header',
      width: 200,
    },
    {
      headerName: 'Action',
      sortable: false,
      filter: false,
      headerClass: 'bold-header',
      field: 'action',
      cellRenderer: function (params: any) {
        if (!params.data) return null;
        const projectId = params.data.project_id;
        var updateProject = document.createElement('button');
        updateProject.className = 'btn btn-primary action-icons ';
        updateProject.innerHTML =
          '<i class="fa fa-pencil " aria-hidden="true"></i>';
        updateProject.style.marginRight = '10px';
        updateProject.addEventListener('click', () => {
          params.context.componentParent.upadateProject(projectId);
        });

        var deleteProject = document.createElement('button');
        deleteProject.className = 'btn btn-danger action-icons';
        deleteProject.innerHTML =
          '<i class="fa fa-trash" aria-hidden="true"></i>';

        deleteProject.addEventListener('click', () => {
          params.context.componentParent.deleteProject(projectId);
        });

        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'action-buttons';
        buttonContainer.style.display = 'flex';
        buttonContainer.appendChild(updateProject);
        buttonContainer.appendChild(deleteProject);
        return buttonContainer;
      },
      pinned: 'right',
      width: 125,
      cellRendererParams: {
        context: {
          componentParent: this,
        },
      },
    },
    {
      pinned: 'right',
      width: 50,
      headerName: '',
      headerClass: 'bold-header settings-header',
      sortable: false,
      filter: false,
      headerComponentParams: {
        icon: 'fa-cog',
      },
    },
  ];

  defaultColDef: ColDef = {
    width: 170,
    filter: true,
    headerComponentParams: {
      innerHeaderComponent: CustomInnerHeader,
    },
  };
  gridOptions: GridOptions = {
    columnHoverHighlight: true,
    tooltipShowMode: 'whenTruncated',
    onGridPreDestroyed: () => {
      this.saveGridState();
      setTimeout(() => {
        this.gridApiActive = null;
      }, 100);
    },
    cacheBlockSize: 1000,
    rowClassRules: {
      'even-row': (params) => {
        const rowIndex = params.node?.rowIndex;
        return rowIndex != null && rowIndex % 2 === 1;
      },
    },
    columnDefs: this.colDefs,
    defaultColDef: this.defaultColDef,
    pagination: true,
    paginationPageSize: 50,
    paginationPageSizeSelector: [50, 100, 500, 1000],
    scrollbarWidth: 15,

    theme: themeQuartz.withParams({
      wrapperBorder: false,
      headerRowBorder: false,
      // rowBorder: { style: 'solid', color: '#a7a7a7' },
      // columnBorder: { style: 'solid', color: '#a7a7a7' },
    }),
  };

  ngOnInit() {
    this.initializeColumnToggleList();
    window.addEventListener('beforeunload', () => {
      localStorage.removeItem('gridState');
    });
  }
  openSideBar() {
    this.openSidebar = true;
    this.ngZone.run(() => {
      this.openSidebar = true;
    });
  }

  initializeColumnToggleList() {
    this.columnToggleList = this.colDefs
      .filter((col) => col.headerName)
      .map((col) => ({
        field: col.field!,
        headerName: col.headerName as string,
        visible: true,
      }));
  }

  toggleColumn(col: ColDef & { visible?: boolean }) {
    if (!this.gridApiActive) return;
    col.visible = !col.visible;
    this.gridApiActive.setColumnsVisible([col.field!], col.visible);
    this.allSelected = this.columnToggleList.every((col) => col.visible);
  }

  allSelected: boolean = true;
  toggleAllColumns() {
    const allVisible = this.columnToggleList.every((col) => col.visible);
    this.allSelected = !allVisible;
    if (this.allSelected) {
      this.selectAllColumns();
    } else {
      this.columnToggleList.forEach((col) => {
        if (col.field && col.visible) {
          col.visible = false;
          this.gridApiActive?.setColumnsVisible([col.field], false);
        }
      });
    }
  }

  selectAllColumns() {
    if (this.allSelected) {
      this.columnToggleList.forEach((col) => {
        if (!col.visible) {
          col.visible = true;
          this.gridApiActive?.setColumnsVisible([col.field]!, true);
        }
      });
    }
  }
  fetchProjectData() {
    if (!this.gridApiActive) return;
    const pageSize = this.gridApiActive?.paginationGetPageSize() ?? 50;
    const datasource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        const start = params.startRow;
        const end = params.endRow;
        const search = this.searchInput ?? '';
        const sortModel = params.sortModel;
        const filterModel = params.filterModel;

        this.userService
          .projects(start, end, search, sortModel, filterModel)
          .subscribe({
            next: (res) => {
              const rows = res?.rows ?? [];

              const lastRow = res?.lastRow ?? 0;

              if (res.status && rows.length > 0) {
                this.projectList = rows;
                params.successCallback(rows, lastRow);
                this.gridApiActive?.hideOverlay();
              } else {
                this.projectList = [];
                params.successCallback([], 0);
                this.gridApiActive?.showNoRowsOverlay();
              }
            },
            error: () => {
              params.failCallback();
              this.gridApiActive?.showNoRowsOverlay();
              this.toastr.error('Server error');
            },
          });
      },
    };

    this.gridApiActive.setGridOption('datasource', datasource);
  }
  previousPageSize = 50;

    onPaginationChanged() {
      if (!this.gridApiActive) return;
      const currentPageSize = this.gridApiActive.paginationGetPageSize();
      if (currentPageSize !== this.previousPageSize) {
        this.previousPageSize = currentPageSize;
        this.gridApiActive.setGridOption('cacheBlockSize', currentPageSize);

        this.gridApiActive.paginationGoToFirstPage();
        // this.fetchProjectData(); 
      }
    }

  addProject() {
    this.router.navigate(['/projects/add-project/']);
  }
  upadateProject(id: number) {
    this.router.navigate([`/projects/update-project/`, id]);
  }
  deleteProject(id: number) {
    this.userService.deleteProject(id).subscribe({
      next: (res: any) => {
        this.toastr.success('Project deleted successfully');

        this.projectList = this.projectList.filter((project) => {
          return project.project_id !== id;
        });
        this.fetchProjectData();
      },
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApiActive = params.api;

    this.fetchProjectData();
    setTimeout(() => {
      this.restoreGridState();

      const settingsHeader = document.querySelector(
        '.ag-header-cell.settings-header'
      );
      if (settingsHeader) {
        settingsHeader.addEventListener('click', () => {
          this.openSideBar();
        });
      }
    });
  }
  searchInput: any;
  onFilterBoxChanged() {
    // this.gridApiActive?.setGridOption('quickFilterText', this.searchInput);
    this.fetchProjectData();
  }

  onFilterChanged() {
    if (!this.gridApiActive) return;
    this.filterModel = this.gridApiActive.getFilterModel();
  }
  onSortChanged() {
    if (!this.gridApiActive) return;
    const columnState = this.gridApiActive.getColumnState() ?? [];
    this.sortModel = columnState
      .filter((col) => col.sort)
      .map((col) => ({
        colId: col.colId,
        sort: col.sort,
        sortIndex: col.sortIndex,
      }));
  }

  saveGridState() {
    const currentPage = this.gridApiActive?.paginationGetCurrentPage() ?? 50;
    console.log('Saving pageSize:', currentPage);
    const gridState = {
      columnState: this.gridApiActive?.getColumnState(),
      filterModel: this.filterModel ?? {},
      sortModel: this.sortModel ?? [],
      currentPage: this.gridApiActive?.paginationGetCurrentPage() ?? 0,
      pageSize: this.gridApiActive?.paginationGetPageSize() ?? 50,
      searchInput: this.searchInput ?? '',
    };

    localStorage.setItem('gridState', JSON.stringify(gridState));
  }
  private savedPageToRestore: number | null = null;

  restoreGridState() {
    const savedState = localStorage.getItem('gridState');
    if (!savedState || !this.gridApiActive) return;

    const {
      columnState,
      sortModel,
      filterModel,
      currentPage,
      pageSize,
      searchInput,
    } = JSON.parse(savedState);

    this.searchInput = searchInput ?? '';
    this.sortModel = sortModel ?? [];
    this.filterModel = filterModel ?? [];

    if (columnState?.length) {
      this.gridApiActive.applyColumnState({
        state: columnState,
        applyOrder: true,
      });
    }

    this.gridApiActive?.applyColumnState({
      state: this.sortModel.map((s) => ({
        colId: s.colId,
        sort: s.sort,
        sortIndex: s.sortIndex,
      })),
    });

    this.gridApiActive.setFilterModel(this.filterModel);

    if (pageSize) {
      this.gridApiActive.setGridOption('paginationPageSize', pageSize || 50);
      this.previousPageSize = pageSize;
    }

    if (typeof currentPage === 'number') {
      this.savedPageToRestore = currentPage;
    }

    this.fetchProjectData();
  }

  onFirstDataRendered() {
    if (this.savedPageToRestore !== null && this.gridApiActive) {
      this.gridApiActive.paginationGoToPage(this.savedPageToRestore);
      this.savedPageToRestore = null;
    }
  }

  // ngOnDestroy(): void {
  //   if (this.gridApiActive) {
  //     this.saveGridState();
  //     console.log('savedd?', localStorage.getItem('gridState'));
  //   }
  // }
}
