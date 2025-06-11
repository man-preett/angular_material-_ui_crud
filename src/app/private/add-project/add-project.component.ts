import { Component } from '@angular/core';
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
    private route: ActivatedRoute
  ) {}
  project: project[] = [];
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
      project_name: this.projectForm.value.projectName,
      project_description: this.projectForm.value.projectDescription,
      project_tech: this.projectForm.value.projectTech,
      project_lead: this.projectForm.value.projectLead,
      project_manager: this.projectForm.value.projectManager,
      project_client: this.projectForm.value.projectClient,
      project_status: this.projectForm.value.projectStatus,
      management_tool: this.projectForm.value.manageTool,
      management_url: this.projectForm.value.manageUrl,
      repo_tool: this.projectForm.value.repoTool,
      repo_url: this.projectForm.value.repoUrl,
      project_start_date: this.projectForm.value.projectStartDate,
      project_deadline_date: this.projectForm.value.projectDeadlineDate,
      project_budget: this.projectForm.value.projectBudget,
      project_milestone_release_date:
        this.projectForm.value.projectMilestoneDate,
      project_priority: this.projectForm.value.projectPriority,
      project_location: this.projectForm.value.projectLocation,
      project_type: this.projectForm.value.projectType,
      project_approval_status: this.projectForm.value.projectApproveStatus,
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
    this.userService.createProject(getData).subscribe({
      next: (res) => {
        if (res.status) {
          res.data = this.project;
          this.router.navigate(['/projects']);
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
    this.router.navigate(['/projects']);
  }

  ngOnInit() {
    this.projectData();
    this.id = this.route.snapshot.paramMap.get('id');
  }

  projectData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.getProject(id).subscribe({
        next: (res) => {
          if (res.status) {
            this.project = res.data;
            this.projectForm.patchValue({
              projectName: res.data.project_name,
              projectDescription: res.data.project_description,
              projectTech: res.data.project_tech,
              projectLead: res.data.project_lead,
              projectManager: res.data.project_manager,
              projectClient: res.data.project_client,
              projectStatus: res.data.project_status,
              manageTool: res.data.management_tool,
              manageUrl: res.data.management_url,
              repoTool: res.data.repo_tool,
              repoUrl: res.data.repo_url,
              projectStartDate: res.data.project_startDate,
              projectDeadlineDate: res.data.project_deadlineDate,
              projectBudget: res.data.project_budget,
              projectMilestoneDate: res.data.project_milestone_release_date,
              projectPriority: res.data.project_priority,
              projectLocation: res.data.project_location,
              projectType: res.data.project_type,
              projectApproveStatus: res.data.project_approval_status,
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
    this.userService.updateProject(getData, this.id).subscribe({
      next: (res) => {
        if (res.status) {
          res.data = this.project;
          this.router.navigate(['/projects']);
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
