import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import {
  ColDef,
  GridOptions,
  GridReadyEvent,
  themeQuartz,
  GridApi,
} from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'app-projects',
  imports: [AgGridAngular, FormsModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  projectList: any[] = [];
  gridApiActive: GridApi | null = null;

  colDefs: ColDef[] = [
    {
      headerName: 'Sr no.',
      pinned: 'left',
      headerClass: 'bold-header',
      width: 100,
      cellStyle: { borderRight: '2px solid #a7a7a7' },
      cellRenderer: function (params: any) {
        return params?.node?.rowIndex + 1;
      },
    },
    {
      field: 'project_name',
      headerName: 'Project Name',
      headerClass: 'bold-header',
    },
    {
      field: 'project_description',
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
      headerName: 'Manangement url',
      headerClass: 'bold-header',
    },
    { field: 'repo_tool', headerName: 'Repo tool', headerClass: 'bold-header' },
    { field: 'repo_url', headerName: 'Repo url', headerClass: 'bold-header' },
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
      headerName: 'Project Type',
      headerClass: 'bold-header',
    },
    {
      field: 'project_approval_status',
      headerName: 'Project approve status',
      headerClass: 'bold-header',
    },
    {
      headerName: 'Action',
      headerClass: 'bold-header',
      cellRenderer: function (params: any) {
        const projectId = params.data.project_id;

        var updateProject = document.createElement('button');
        updateProject.className = 'btn btn-primary';
        updateProject.innerHTML =
          '<i class="fa fa-pencil" aria-hidden="true"></i>';
        updateProject.style.marginLeft = '10px';
        updateProject.style.marginRight = '10px';
        updateProject.addEventListener('click', () => {
          params.context.componentParent.upadateProject(projectId);
        });

        var deleteProject = document.createElement('button');
        deleteProject.className = 'btn btn-danger';
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
      width: 150,
      cellRendererParams: {
        context: {
          componentParent: this,
        },
      },
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
  };
  gridOptions: GridOptions = {
    columnDefs: this.colDefs,
    defaultColDef: this.defaultColDef,
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [10, 100, 500, 1000, 1000, 10000, 100000],
    scrollbarWidth: 50,
    theme: themeQuartz.withParams({
      wrapperBorder: false,
      headerRowBorder: false,
      rowBorder: { style: 'solid', color: '#a7a7a7' },
      columnBorder: { style: 'solid', color: '#a7a7a7' },
    }),
    getRowStyle: (params) => {
      const rowIndex = params?.node?.rowIndex;

      if (rowIndex != null && rowIndex % 2 === 0) {
        return { background: '#f8f8f8' };
      }
      return undefined;
    },
  };

  ngOnInit() {
    this.userService.projects().subscribe({
      next: (res: any) => {
        if (res.status) {
          console.log(res.data, 'res.data');

          this.projectList = res.data;
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }
  addProject() {
    this.router.navigate(['/home/add-project/']);
  }
  upadateProject(id: number) {
    this.router.navigate([`/home/update-project/`, id]);
  }
  deleteProject(id: number) {
    this.userService.deleteProject(id).subscribe({
      next: (res: any) => {
        this.toastr.success('Project deleted successfully');
        this.projectList = this.projectList.filter((project) => {
          return project.project_id !== id;
        });
      },
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApiActive = params.api;
  }

  isSidePanelVisible: boolean = false;

  searchInput: any;
  onFilterBoxChanged() {
    this.gridApiActive?.setGridOption('quickFilterText', this.searchInput);
  }
}
