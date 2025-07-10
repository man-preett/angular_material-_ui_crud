import { Component } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { InputBoxComponent } from '../../comman/components/UI/input-box/input-box.component';
import { ButtonComponent } from '../../comman/components/UI/button/button.component';
import { DatePickerComponent } from '../../comman/components/UI/date-picker/date-picker.component';
import { SelectDropdownComponent } from '../../comman/components/UI/select-dropdown/select-dropdown.component';
import { RadioComponent } from '../../comman/components/UI/radio/radio.component';
import { CheckBoxComponent } from '../../comman/components/UI/checkBox/checkBox.component';
import { DateRangePickerComponent } from '../../comman/components/UI/date-range-picker/date-range-picker.component';
import { project } from '../../interfaces/add-project';
import { Project, ProjectsService, Response } from '../../api-client';

@Component({
  selector: 'app-add-project',
  imports: [
    ReactiveFormsModule,
    InputBoxComponent,
    ButtonComponent,
    DatePickerComponent,
    SelectDropdownComponent,
    RadioComponent,
    CheckBoxComponent,
    DateRangePickerComponent,
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss',
})
export class AddProjectComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private projectService: ProjectsService
  ) {}
  project: project | null = null;
  statusOptions = [
    { value: 'Coming soon', display: 'Coming soon' },
    { value: 'Development started', display: 'Development started' },
    { value: 'Launched', display: 'Launched' },
  ];

  manageToolOptions = [
    { value: 'Trello', display: 'Trello' },
    { value: 'Zira', display: 'Zira' },
  ];

  repoToolOptions = [
    { value: 'Git lab', display: 'Git lab' },
    { value: 'Bit bucket', display: 'Bit bucket' },
  ];
  projectPriorityOptions = [
    { value: 'Low', display: 'Low' },
    { value: 'Medium', display: 'Medium' },
    { value: 'High', display: 'High' },
  ];
  projectTypeOptions = [
    { value: 'Mobile Development', display: 'Mobile Development' },
    { value: 'E-commerce Development', display: 'E-commerce Development' },
    { value: 'Web Development', display: 'Web Development' },
    { value: 'Data Analytics', display: '	Data Analytics' },
    { value: 'Supply Chain', display: 'Supply Chain' },
    { value: 'Healthcare CRM', display: 'Healthcare CRM' },
    { value: 'Machine Learning', display: 'Machine Learning' },
    { value: 'Travel', display: 'Travel' },
  ];
  projectApvStatusOptions = [
    { value: 'Approved', display: 'Approved' },
    { value: 'Pending', display: 'Pending' },
    { value: 'Rejected', display: 'Rejected' },
  ];

  projectForm = new FormGroup({
    projectName: new FormControl('', Validators.required),
    projectDescription: new FormControl('', Validators.required),
    projectTech: new FormControl('', Validators.required),
    projectLead: new FormControl('', Validators.required),
    projectManager: new FormControl('', Validators.required),
    projectClient: new FormControl('', Validators.required),
    projectStatus: new FormControl('', Validators.required),
    manageTool: new FormControl('', Validators.required),
    manageUrl: new FormControl('', Validators.required),
    repoTool: new FormControl('', Validators.required),
    repoUrl: new FormControl('', Validators.required),
    projectStartDate: new FormControl('', Validators.required),
    projectDeadlineDate: new FormControl('', Validators.required),
    projectBudget: new FormControl('', Validators.required),
    projectMilestoneDate: new FormControl('', Validators.required),
    projectPriority: new FormControl('', Validators.required),
    projectLocation: new FormControl('', Validators.required),
    projectType: new FormControl('', Validators.required),
    projectApproveStatus: new FormControl('', Validators.required),
  });

  id: any | null;
  formData() {
    const data = {
      project_name: this.projectForm.value.projectName ?? '',
      project_description: this.projectForm.value.projectDescription ?? '',
      project_tech: this.projectForm.value.projectTech ?? '',
      project_lead: this.projectForm.value.projectLead ?? '',
      project_manager: this.projectForm.value.projectManager ?? '',
      project_client: this.projectForm.value.projectClient ?? '',
      project_status: this.projectForm.value.projectStatus ?? '',
      management_tool: this.projectForm.value.manageTool ?? '',
      management_url: this.projectForm.value.manageUrl ?? '',
      repo_tool: this.projectForm.value.repoTool ?? '',
      repo_url: this.projectForm.value.repoUrl ?? '',
      project_startDate: this.projectForm.value.projectStartDate ?? '',
      project_deadlineDate: this.projectForm.value.projectDeadlineDate ?? '',
      project_budget: +(this.projectForm?.value.projectBudget ?? '0') || 0,
      project_milestone_release_date:
        this.projectForm.value.projectMilestoneDate ?? '',
      project_priority: this.projectForm.value.projectPriority ?? '',
      project_location: this.projectForm.value.projectLocation ?? '',
      project_type: Array.isArray(this.projectForm.value.projectType)
        ? this.projectForm.value.projectType
        : (this.projectForm.value.projectType ?? '').split(','),
      project_approval_status:
        this.projectForm.value.projectApproveStatus ?? '',
      project_user_id: null,
    };
    return data;
  }

  onAddProject() {
    if (this.projectForm.invalid) {
      Object.keys(this.projectForm.controls).forEach((field) => {
        const control = this.projectForm.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
      return;
    }

    const getData = this.formData();
    this.projectService.createProjectApiProjectsPost(getData).subscribe({
      next: (res) => {
        if (res.status) {
          this.project = res.data ?? null;
          // this.router.navigate(['/projects']);
          this.location.back();
          this.toastr.success('Project created suceesfully');
        }
      },
      error: (err) => {
        this.toastr.error(err);
      },
    });
  }
  onResetProject() {
    this.projectForm.reset({
      projectStatus: '',
      manageTool: '',
      repoTool: '',
      projectBudget: '',
      projectPriority: '',
      projectApproveStatus: '',
    });
  }
  onBack() {
    // this.router.navigate(['/projects']);
    this.location.back();
  }

  ngOnInit() {
    this.projectData();
    this.id = this.route.snapshot.paramMap.get('id');
  }

  projectData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectService.getProjectApiProjectsIdGet(id).subscribe({
        next: (res: any) => {
          if (res.status && res.data) {
            const data = res.data;
            this.project = data;

            this.projectForm.patchValue({
              projectName: data.project_name,
              projectDescription: data.project_description,
              projectTech: data.project_tech,
              projectLead: data.project_lead,
              projectManager: data.project_manager,
              projectClient: data.project_client,
              projectStatus: data.project_status,
              manageTool: data.management_tool,
              manageUrl: data.management_url,
              repoTool: data.repo_tool,
              repoUrl: data.repo_url,
              projectStartDate: data.project_startDate,
              projectDeadlineDate: data.project_deadlineDate,
              projectBudget: data.project_budget,
              projectMilestoneDate: data.project_milestone_release_date,
              projectPriority: data.project_priority,
              projectLocation: data.project_location,
              projectType: data.project_type,
              projectApproveStatus: data.project_approval_status,
            });
            // this.dateRangeForm.patchValue({
            //   projectStartDate: this.project.project_startDate,
            //   projectDeadlineDate: this.project.project_deadlineDate,
            // });
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

  onUpdateProject() {
    if (this.projectForm.invalid) {
      Object.keys(this.projectForm.controls).forEach((field) => {
        const control = this.projectForm.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });

      return;
    }
    const getData = this.formData();
    this.projectService
      .updateProjectApiProjectsIdPut(this.id, getData)
      .subscribe({
        next: (res) => {
          if (res.status) {

            res.data = this.project;
            // this.router.navigate(['/projects']);
            this.location.back();
            this.toastr.success('Project updated suceesfully');
          } else {
            this.toastr.error(res.message);
          }
        },
        error: (res) => {
          this.toastr.error(res.error.message);
        },
      });
  }
  onSubmit() {
    if (!this.id) {
      this.onAddProject();
    } else {
      this.onUpdateProject();
    }
  }
}
