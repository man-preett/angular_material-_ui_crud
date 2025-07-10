import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  HostListener,
  ElementRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../comman/components/UI/dialog/dialog.component';
import { projectList } from '../../interfaces/project';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { debounceTime, Subject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { ChipsComponent } from '../../comman/components/UI/chips/chips.component';
import { BehaviorService } from '../../services/behavior.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ProjectsService } from '../../api-client';

type FilterCondition = {
  type:
    | 'contains'
    | 'notContains'
    | 'equals'
    | 'notEquals'
    | 'startsWith'
    | 'endsWith'
    | 'blank'
    | 'Notblank';
  filter: string;
};

type ColumnFilter =
  | FilterCondition
  | { operator: 'AND' | 'OR'; conditions: FilterCondition[] };
@Component({
  selector: 'app-projects',
  templateUrl: './ngx-project.component.html',
  styleUrls: ['./ngx-project.component.scss'],
  imports: [
    NgxDatatableModule,
    FormsModule,
    MatIconModule,
    NgClass,
    NgIf,
    NgFor,
    NgStyle,
    ChipsComponent,
  ],
})
export class NgxProjectComponent implements OnInit {
  @ViewChild('actionTpl', { static: true }) actionTpl!: TemplateRef<any>;
  @ViewChild('settingsHeaderTpl', { static: true })
  settingsHeaderTpl!: TemplateRef<any>;
  @ViewChild('filterHeaderTpl', { static: true })
  filterHeaderTpl!: TemplateRef<any>;
  @ViewChild('filterBox') filterBox!: ElementRef;
  @ViewChild(DatatableComponent) table!: DatatableComponent;

  rows: projectList[] = [];
  columns: any[] = [];
  allColumns: any[] = [];
  isLoading = false;
  totalRecords = 0;
  currentPage = 0;
  limit = 100;
  offset = 0;
  searchInput = '';
  sortProp: string = '';
  sortDir: 'asc' | 'desc' | '' = '';
  columnFilters: {
    [prop: string]: ColumnFilter;
  } = {};
  activeFilterColumn: string | null = null;
  filterPosition = { top: 0, left: 0 };
  filterTypes = [
    { label: 'Contains', value: 'contains' },
    { label: 'Does not contain', value: 'notContains' },
    { label: 'Equals', value: 'equals' },
    { label: 'Does not equal', value: 'notEquals' },
    { label: 'Begins with', value: 'startsWith' },
    { label: 'Ends with', value: 'endsWith' },
    { label: 'Blank', value: 'blank' },
    { label: 'Not blank', value: 'Notblank' },
  ];
  selectedFilterType:
    | 'contains'
    | 'notContains'
    | 'equals'
    | 'notEquals'
    | 'startsWith'
    | 'endsWith'
    | 'blank'
    | 'Notblank' = 'contains';
  selectedFilterValue = '';
  secondFilterType:
    | 'contains'
    | 'notContains'
    | 'equals'
    | 'notEquals'
    | 'startsWith'
    | 'endsWith'
    | 'blank'
    | 'Notblank' = 'contains';
  secondFilterValue = '';
  filterLogic: 'AND' | 'OR' = 'AND';
  searchInputChanged = new Subject<string>();
  filterInputChanged = new Subject<void>();
  pageLimitOption = [{ value: 100 }, { value: 500 }, { value: 1000 }];
  totalPages: number = 0;
  openSidebar: boolean = false;
  columnToggleList: { prop: string; name: string; visible: boolean }[] = [];
  allSelected: boolean = true;
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog,
    private resizeSubject: BehaviorService,
    private projectService: ProjectsService
  ) {}

  ngOnInit() {
    this.resizeSubject.resize.subscribe(() => {
      setTimeout(() => {
        this.table.recalculate();
      }, 100);
    });
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
    this.columnsList();
    this.restoreGridState();
    this.fetch();
    this.searchInputChanged.pipe(debounceTime(500)).subscribe(() => {
      this.fetch();
    });
    this.filterInputChanged.pipe(debounceTime(500)).subscribe(() => {
      this.performFilter();
    });
  }
  beforeUnloadHandler = () => this.savedGridState();
  ngOnDestroy() {
    this.savedGridState();
  }

  columnsList() {
    this.allColumns = [
      {
        prop: 'project_name',
        name: 'Project Name',
        width: 170,
        headerTemplate: this.filterHeaderTpl,
        draggable: true,
      },
      {
        prop: 'project_description',
        name: 'Project Description',
        width: 170,
        headerTemplate: this.filterHeaderTpl,
        draggable: true,
      },
      {
        prop: 'project_tech',
        name: 'Project Tech',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
        draggable: true,
      },
      {
        prop: 'project_status',
        name: 'Project Status',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'project_lead',
        name: 'Project Lead',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'project_manager',
        name: 'Project Manager',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'project_client',
        name: 'Project Client',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'management_tool',
        name: 'Management Tool',
        width: 170,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'management_url',
        name: 'Management URL',
        width: 180,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'repo_tool',
        name: 'Repo Tool',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'repo_url',
        name: 'Repo URL',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'project_startDate',
        name: 'Project Start Date',
        width: 180,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'project_deadlineDate',
        name: 'Project Deadline ',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'project_budget',
        name: 'Project Budget',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'project_priority',
        name: 'Project Priority',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'project_location',
        name: 'Project Location',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        prop: 'project_type',
        name: 'Project Type',
        headerTemplate: this.filterHeaderTpl,
        width: 160,
      },
      {
        prop: 'project_approval_status',
        name: 'Approve Status',
        width: 160,
        headerTemplate: this.filterHeaderTpl,
      },
      {
        name: 'Actions',
        cellTemplate: this.actionTpl,
        width: 80,
        frozenRight: true,
        isFixed: true,
      },
      {
        name: '',
        headerClass: 'settings-header',
        width: 80,
        headerTemplate: this.settingsHeaderTpl,
        frozenRight: true,
        isFixed: true,
      },
    ];

    this.columns = [...this.allColumns];

    this.columnToggleList = this.allColumns
      .filter((col) => col.prop)
      .map((col) => ({
        prop: col.prop,
        name: col.name,
        visible: true,
      }));
  }

  fetch() {
    this.isLoading = true;
    const offset = this.currentPage * this.limit;
    const limit = this.limit;
    const filterModel: any = {};
    for (const prop in this.columnFilters) {
      const filter = this.columnFilters[prop];
      if ('operator' in filter && Array.isArray(filter.conditions)) {
        filterModel[prop] = {
          operator: filter.operator,
          conditions: filter.conditions,
        };
      } else if ('type' in filter && 'filter' in filter && filter.filter) {
        filterModel[prop] = {
          type: filter.type,
          filter: filter.filter,
        };
      }
    }

    this.projectService
      .getAllProjectsApiProjectsGet(
        offset,
        limit,
        this.sortProp && this.sortDir ? `${this.sortProp}_${this.sortDir}` : undefined,
        this.searchInput,
        JSON.stringify(filterModel)
      )
      .subscribe({
        next: (res) => {
          console.log(res, 'res');

          this.rows = res.data || [];
          this.totalRecords = res.total ?? 0;
          this.isLoading = false;
          this.totalPages = Math.round(this.totalRecords / this.limit);
        },
        error: (err) => {
          this.toastr.error(err.message);
          this.isLoading = false;
        },
      });
  }

  onSearchChanged() {
    this.searchInputChanged.next(this.searchInput);
  }

  onSort(event: any) {
    const sort = event.sorts[0];
    if (this.sortProp === sort.prop) {
      if (this.sortDir === 'asc') {
        this.sortDir = 'desc';
      } else if (this.sortDir === 'desc') {
        this.sortProp = '';
      } else {
        this.sortDir = 'asc';
      }
    } else {
      this.sortProp = sort.prop;
      this.sortDir = 'asc';
    }

    this.fetch();
  }

  addProject() {
    this.router.navigate(['/projects/add-project/']);
  }

  // updateProject(id: string) {
  //   this.router.navigate(['/projects/update-project/', id]);
  // }

  updateProject(id: string) {
    if (!id) {
      this.toastr.error('Invalid project ID');
      return;
    }
    this.router.navigate(['/projects/update-project', id]);
  }

  deleteProject(id: string) {
    this.projectService.deleteProjectApiProjectsIdDelete(id).subscribe(() => {
      this.toastr.success('Project deleted successfully');
      this.fetch();
    });
  }

  openConfirmDialog(id: string) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { text: 'Are you sure you want to delete this project?' },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.deleteProject(id);
    });
  }

  onPageSizeChange() {
    this.currentPage = 0;
    this.fetch();
  }

  onPreviousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.fetch();
    }
  }

  onNextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.fetch();
    }
  }

  onFirstPage() {
    this.currentPage = 0;
    this.fetch();
  }

  onLastPage() {
    this.currentPage = this.totalPages - 1;
    this.fetch();
  }

  get firstRow(): number {
    return this.totalRecords === 0 ? 0 : this.currentPage * this.limit + 1;
  }

  get lastRow(): number {
    const lastRow = (this.currentPage + 1) * this.limit;
    return lastRow > this.totalRecords ? this.totalRecords : lastRow;
  }

  isColumnVisible(prop: string): boolean {
    return this.columnToggleList.find((c) => c.prop === prop)?.visible ?? false;
  }

  toggleColumn(prop: string): void {
    const toggleItem = this.columnToggleList.find((c) => c.prop === prop);
    if (!toggleItem) return;
    toggleItem.visible = !toggleItem.visible;
    this.columns = this.allColumns.filter(
      (c) =>
        c.isFixed ||
        this.columnToggleList.find((t) => t.prop === c.prop && t.visible)
    );
  }

  toggleAllColumns() {
    this.allSelected = !this.allSelected;
    this.columnToggleList = this.columnToggleList.map((col) => ({
      ...col,
      visible: this.allSelected,
    }));
    this.columns = this.allColumns.filter(
      (c) =>
        c.isFixed ||
        this.columnToggleList.find((t) => t.prop === c.prop && t.visible)
    );
  }

  performFilter() {
    if (this.activeFilterColumn) {
      const conditions: any[] = [];
      if (this.selectedFilterValue) {
        conditions.push({
          filterType: 'text',
          type: this.selectedFilterType,
          filter: this.selectedFilterValue,
        });
      }
      if (this.secondFilterValue) {
        conditions.push({
          filterType: 'text',
          type: this.secondFilterType,
          filter: this.secondFilterValue,
        });
      }
      if (conditions.length > 1) {
        this.columnFilters[this.activeFilterColumn] = {
          operator: 'AND',
          conditions,
        };
      } else if (conditions.length === 1) {
        this.columnFilters[this.activeFilterColumn] = conditions[0];
      } else {
        delete this.columnFilters[this.activeFilterColumn];
        this.activeFilterColumn = null;
      }
    }

    this.fetch();
  }

  applyFilter() {
    this.filterInputChanged.next();
  }

  toggleFilter(prop: string, iconRef: HTMLElement) {
    if (this.activeFilterColumn === prop) {
      this.activeFilterColumn = null;
    } else {
      const rect = iconRef.getBoundingClientRect();
      this.filterPosition = {
        top: rect.top + 25 + window.scrollY,
        left: rect.left + window.scrollX,
      };

      const existingFilter = this.columnFilters[prop];
      if (
        existingFilter &&
        'operator' in existingFilter &&
        Array.isArray(existingFilter.conditions)
      ) {
        this.selectedFilterValue = existingFilter.conditions[0]?.filter || '';
        this.selectedFilterType =
          existingFilter.conditions[0]?.type || 'contains';
        this.secondFilterValue = existingFilter.conditions[1]?.filter || '';
        this.secondFilterType =
          existingFilter.conditions[1]?.type || 'contains';
        this.filterLogic = existingFilter.operator;
      } else if (existingFilter && 'filter' in existingFilter) {
        this.selectedFilterValue = existingFilter.filter;
        this.selectedFilterType = existingFilter.type;
        this.secondFilterValue = '';
        this.secondFilterType = 'contains';
      } else {
        this.selectedFilterValue = '';
        this.selectedFilterType = 'contains';
        this.secondFilterValue = '';
        this.secondFilterType = 'contains';
      }

      setTimeout(() => {
        this.activeFilterColumn = prop;
      });
    }
  }
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    const clickedInside = this.filterBox?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.activeFilterColumn = null;
    }
  }

  getReadableFilters(): string[] {
    const model = this.columnFilters as any;
    if (!model) return [];
    return Object.entries(model).map(([key, filter]: [string, any]) => {
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
    });
  }

  formatKey(key: string): string {
    return key
      .split('_')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  }

  hasFilter(): boolean {
    return this.columnFilters && Object.keys(this.columnFilters).length > 0;
  }

  clearFilters() {
    this.activeFilterColumn = null;
    this.selectedFilterValue = '';
    this.secondFilterValue = '';
    this.columnFilters = {};
    this.fetch();
  }

  removeFilter(key: string) {
    if (!this.columnFilters) return;
    this.columnFilters = Object.fromEntries(
      Object.entries(this.columnFilters).filter(([k]) => k !== key)
    );
    this.activeFilterColumn = null;
    this.selectedFilterValue = '';
    this.secondFilterValue = '';
    this.fetch();
  }

  savedGridState() {
    const gridState = {
      searchInput: this.searchInput,
      pageSize: this.limit,
      currentPage: this.currentPage,
      filter: this.columnFilters,
      sortProp: this.sortProp,
      sortDir: this.sortDir,
      columnToggleList: this.columnToggleList,
    };
    localStorage.setItem('ngxState', JSON.stringify(gridState));
  }

  restoreGridState() {
    const saved = localStorage.getItem('ngxState');
    if (saved) {
      const state = JSON.parse(saved);
      this.searchInput = state.searchInput || '';
      this.limit = state.pageSize || 100;
      this.currentPage = state.currentPage || 0;
      this.sortProp = state.sortProp || '';
      this.sortDir = state.sortDir || '';
      this.columnFilters = state.filter || {};
      this.offset = this.currentPage * this.limit;
      if (state.columnToggleList) {
        this.columnToggleList = state.columnToggleList;
        this.columns = this.allColumns.filter(
          (c) =>
            c.isFixed ||
            this.columnToggleList.find((t) => t.prop === c.prop && t.visible)
        );
      }
    }
  }

  //   hoveredColumn: string | null = null;

  // onCellMouseEnter(columnProp: string) {
  //   this.hoveredColumn = columnProp;
  // }

  // onCellMouseLeave() {
  //   this.hoveredColumn = null;
  // }

  // getCellClass = (colProp: string) => {
  //   return ({ column }: any) => {
  //     return this.hoveredColumn === colProp && column.prop === colProp
  //       ? 'hovered-column'
  //       : '';
  //   };
  // }
}
