import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { InputBoxComponent } from '../../comman/components/UI/input-box/input-box.component';
import { ButtonComponent } from '../../comman/components/UI/button/button.component';
import { DatePickerComponent } from '../../comman/components/UI/date-picker/date-picker.component';
import { SelectDropdownComponent } from '../../comman/components/UI/select-dropdown/select-dropdown.component';
import { RadioComponent } from '../../comman/components/UI/radio/radio.component';
import { CheckBoxComponent } from '../../comman/components/UI/checkBox/checkBox.component';

@Component({
  selector: 'app-update-project',
  imports: [
    ReactiveFormsModule,
    InputBoxComponent,
    ButtonComponent,
    DatePickerComponent,
    SelectDropdownComponent,
    RadioComponent,
    CheckBoxComponent,
  ],
  templateUrl: './update-project.component.html',
  styleUrl: './update-project.component.scss',
})
export class UpdateProjectComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  updateProject: any;
  statusOptions: any = [
    { value: 'Coming soon', display: 'Coming soon' },
    { value: 'Development started', display: 'Development started' },
    { value: 'Launched', display: 'Launched' },
  ];

  manageToolOptions: any = [
    { value: 'Trello', display: 'Trello' },
    { value: 'Zira', display: 'Zira' },
  ];

  repoToolOptions: any = [
    { value: 'Git lab', display: 'Git lab' },
    { value: 'Bit bucket', display: 'Bit bucket' },
  ];
  projectPriorityOptions: any = [
    { value: 'Low', display: 'Low' },
    { value: 'Medium', display: 'Medium' },
    { value: 'High', display: 'High' },
  ];
  projectTypeOptions: any = [
    { value: 'Mobile Development', display: 'Mobile Development' },
    { value: 'E-commerce Development', display: 'E-commerce Development' },
    { value: 'Web Development', display: 'Web Development' },
    { value: 'Data Analytics', display: '	Data Analytics' },
    { value: 'Supply Chain', display: 'Supply Chain' },
    { value: 'Healthcare CRM', display: 'Healthcare CRM' },
    { value: 'Machine Learning', display: 'Machine Learning' },
    { value: 'Travel', display: 'Travel' },
  ];
  projectApvStatusOptions: any = [
    { value: 'Approved', display: 'Approved' },
    { value: 'Pending', display: 'Pending' },
    { value: 'Rejected', display: 'Rejected' },
  ];
  updateProjectForm = new FormGroup({
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
    projectPriority: new FormControl('', Validators.required),
    projectLocation: new FormControl('', Validators.required),
    projectType: new FormControl('', Validators.required),
    projectApproveStatus: new FormControl('', Validators.required),
  });
  ngOnInit() {
    this.projectData();
  }
  projectData() {
    const id = this.route.snapshot.paramMap.get('id');
    this.userService.getProject(id).subscribe({
      next: (res: any) => {
        if (res.status) {
          this.updateProject = res.data;
          const fff = this.updateProjectForm.patchValue({
            projectName: this.updateProject.project_name,
            projectDescription: this.updateProject.project_description,
            projectTech: this.updateProject.project_tech,
            projectLead: this.updateProject.project_lead,
            projectManager: this.updateProject.project_manager,
            projectClient: this.updateProject.project_client,
            projectStatus: this.updateProject.project_status,
            manageTool: this.updateProject.management_tool,
            manageUrl: this.updateProject.management_url,
            repoTool: this.updateProject.repo_tool,
            repoUrl: this.updateProject.repo_url,
            projectStartDate: this.updateProject.project_startDate,
            projectDeadlineDate: this.updateProject.project_deadlineDate,
            projectBudget: this.updateProject.project_budget,
            projectPriority: this.updateProject.project_priority,
            projectLocation: this.updateProject.project_location,
            projectType: this.updateProject.project_type,
            projectApproveStatus: this.updateProject.project_approval_status,
          });
        } else {
          this.toastr.error(res.message);
        }
      },
      error: (err) => {
        this.toastr.error(err.message);
      },
    });
  }

  onUpdateProject() {
    if (this.updateProjectForm.invalid) {
      Object.keys(this.updateProjectForm.controls).forEach((field) => {
        const control = this.updateProjectForm.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
      return;
    }
    const id = this.route.snapshot.paramMap.get('id');

    const data: any = {
      project_name: this.updateProjectForm.value.projectName,
      project_description: this.updateProjectForm.value.projectDescription,
      project_tech: this.updateProjectForm.value.projectTech,
      project_lead: this.updateProjectForm.value.projectLead,
      project_manager: this.updateProjectForm.value.projectManager,
      project_client: this.updateProjectForm.value.projectClient,
      project_status: this.updateProjectForm.value.projectStatus,
      management_tool: this.updateProjectForm.value.manageTool,
      management_url: this.updateProjectForm.value.manageUrl,
      repo_tool: this.updateProjectForm.value.repoTool,
      repo_url: this.updateProjectForm.value.repoUrl,
      project_start_date: this.updateProjectForm.value.projectStartDate,
      project_deadline_date: this.updateProjectForm.value.projectDeadlineDate,
      project_budget: this.updateProjectForm.value.projectBudget,
      project_priority: this.updateProjectForm.value.projectPriority,
      project_location: this.updateProjectForm.value.projectLocation,
      project_type: this.updateProjectForm.value.projectType,
      project_approval_status:
        this.updateProjectForm.value.projectApproveStatus,
    };

    this.userService.updateProject(data, id).subscribe({
      next: (res: any) => {
        if (res.status) {
          res.data = this.updateProject;
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
  onBack() {
    this.router.navigate(['/projects']);
  }
}
