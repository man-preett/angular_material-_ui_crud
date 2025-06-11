import { Component, NgZone } from '@angular/core';
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
import { ModuleRegistry } from 'ag-grid-community';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CustomInnerHeader } from '../customHeader';
import { ChipsComponent } from '../../comman/components/UI/chips/chips.component';
import { DialogComponent } from '../../comman/components/UI/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, Subject } from 'rxjs';
import { projectList } from '../../interfaces/project';
ModuleRegistry.registerModules([InfiniteRowModelModule]);
@Component({
  selector: 'app-projects',
  imports: [AgGridAngular, FormsModule, NgClass, MatIconModule, ChipsComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  openSidebar = false;
  isLoading: boolean = false;
  columnToggleList: { field: string; headerName: string; visible: boolean }[] =
    [];
  projectList: projectList[] = [];
  gridApiActive: GridApi | null = null;
  filterModel: any = {};
  sortModel: any[] = [];
  searchInputChanged = new Subject<string>();
  colDefs: ColDef[] = [
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
    {
      field: 'repo_tool',
      headerName: 'Repo tool',
      headerClass: 'bold-header',
    },
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
        updateProject.className = 'btn action-icons ';
        updateProject.innerHTML =
          '<i class="fa fa-pencil " aria-hidden="true"></i>';
        updateProject.style.marginRight = '10px';
        updateProject.addEventListener('click', () => {
          params.context.componentParent.upadateProject(projectId);
        });

        var deleteProject = document.createElement('button');
        deleteProject.className = 'btn action-icons';
        deleteProject.innerHTML =
          '<i class="fa fa-trash" aria-hidden="true"></i>';

        deleteProject.addEventListener('click', () => {
          params.context.componentParent.openConfirmDialog(projectId);
        });

        var buttonContainer = document.createElement('div');
        buttonContainer.className = 'action-buttons';
        buttonContainer.style.display = 'flex';
        buttonContainer.appendChild(updateProject);
        buttonContainer.appendChild(deleteProject);
        return buttonContainer;
      },
      pinned: 'right',
      width: 100,
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
    rowClassRules: {
      'even-row': (params) => {
        const rowIndex = params.node?.rowIndex;
        return rowIndex != null && rowIndex % 2 === 1;
      },
    },
    columnDefs: this.colDefs,
    defaultColDef: this.defaultColDef,
    pagination: true,
    paginationPageSize: 100,
    paginationPageSizeSelector: [100, 500, 1000],
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
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
    this.searchInputChanged
      .pipe(debounceTime(1500))
      .subscribe((searchTerm: string) => {
        this.fetchProjectData();
      });
  }
  private beforeUnloadHandler = () => this.saveGridState();
  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }

  openSideBar() {
    this.openSidebar = true;
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
    this.isLoading = true;
    const datasource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        const offset = params.startRow;
        const limit = this.gridApiActive?.paginationGetPageSize() ?? 100;
        const search = this.searchInput ?? '';
        const sortModel = params.sortModel;
        const filterModel = params.filterModel;

        this.userService
          .projects(offset, limit, search, sortModel, filterModel)
          .subscribe({
            next: (res) => {
              const rows = res?.data;
              const lastRow = res?.total ?? 0;
              if (res.status && rows.length > 0) {
                this.projectList = rows;
                params.successCallback(rows, lastRow);
                this.gridApiActive?.hideOverlay();
                this.isLoading = false;
              } else {
                this.projectList = [];
                params.successCallback([], 0);
                this.gridApiActive?.showNoRowsOverlay();
                this.isLoading = false;
              }
            },
            error: () => {
              params.failCallback();
              this.gridApiActive?.showNoRowsOverlay();
              this.toastr.error('Server error');
              this.isLoading = false;
            },
          });
      },
    };

    this.gridApiActive.setGridOption('datasource', datasource);
  }

  previousPageSize = 100;
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

  openConfirmDialog(id: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { text: 'Are you sure you want to delete the project?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteProject(id);
      } else {
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApiActive = params.api;
    this.restoreGridState();
    setTimeout(() => {
      this.fetchProjectData();

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
  searchInput: string = '';
  previousPage = 0;
  onPaginationChanged() {
    if (!this.gridApiActive) return;
    const currentPageSize = this.gridApiActive.paginationGetPageSize();
    const currentPage = this.gridApiActive.paginationGetCurrentPage();

    if (currentPageSize !== this.previousPageSize) {
      this.previousPageSize = currentPageSize;
      this.gridApiActive.setGridOption('cacheBlockSize', currentPageSize);
      this.gridApiActive.paginationGoToFirstPage();
      return;
    }
  }
  onSearchChanged() {
    // this.gridApiActive?.setGridOption('quickFilterText', this.searchInput);
    this.searchInputChanged.next(this.searchInput);
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
  }

  onFirstDataRendered() {
    if (this.savedPageToRestore !== null && this.gridApiActive) {
      this.gridApiActive.paginationGoToPage(this.savedPageToRestore);
      this.savedPageToRestore = null;
    }
  }

  getReadableFilters(): string[] {
    const model = this.filterModel as any;
    if (!model) return [];
    return Object.entries(model)
      .map(([key, filter]: [string, any]) => {
        if (filter?.operator && Array.isArray(filter.conditions)) {
          const values = filter.conditions
            .map((c: any) => c.filter)
            .filter(Boolean)
            .join(` ${filter.operator} `);
          return `${this.formatKey(key)}: ${values}`;
        } else if (filter?.filter) {
          return `${this.formatKey(key)}: ${filter.filter}`;
        }
        return '';
      })
      .filter(Boolean);
  }

  formatKey(key: string): string {
    return key
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  }
  clearFilters() {
    this.gridApiActive?.setFilterModel(null);
    this.gridApiActive?.onFilterChanged();
    this.filterModel = {};
  }
  hasFilter(): boolean {
    return this.filterModel && Object.keys(this.filterModel).length > 0;
  }

  removeFilter(key: string) {
    if (!this.filterModel || !this.gridApiActive) return;
    this.filterModel = Object.fromEntries(
      Object.entries(this.filterModel).filter(([k]) => k !== key)
    );
    this.gridApiActive.setFilterModel(this.filterModel);
    this.gridApiActive.onFilterChanged();
  }
}
