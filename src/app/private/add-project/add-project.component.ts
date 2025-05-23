import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { InputBoxComponent } from '../../comman/components/UI/input-box/input-box.component';
import { ButtonComponent } from '../../comman/components/UI/button/button.component';
import { DatePickerComponent } from '../../comman/components/UI/date-picker/date-picker.component';
import { SelectDropdownComponent } from '../../comman/components/UI/select-dropdown/select-dropdown.component';
import { RadioComponent } from "../../comman/components/UI/radio/radio.component";

@Component({
  selector: 'app-add-project',
  imports: [
    ReactiveFormsModule,
    InputBoxComponent,
    ButtonComponent,
    DatePickerComponent,
    SelectDropdownComponent,
    RadioComponent,
  ],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.scss',
})
export class AddProjectComponent {
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  project: any;
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
  projectApvStatusOptions: any = [
    { value: 'Approved', display: 'Approved' },
    { value: 'Pending', display: 'Pending' },
    { value: 'Rejected', display: 'Rejected' },
  ];

  addProjectForm = new FormGroup({
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

  onAddProject() {
    if (this.addProjectForm.invalid) {
      Object.keys(this.addProjectForm.controls).forEach((field) => {
        const control = this.addProjectForm.get(field);
        control?.markAsTouched({ onlySelf: true });
        control?.markAsDirty({ onlySelf: true });
      });
      return;
    }
    const data: any = {
      project_name: this.addProjectForm.value.projectName,
      project_description: this.addProjectForm.value.projectDescription,
      project_tech: this.addProjectForm.value.projectTech,
      project_lead: this.addProjectForm.value.projectLead,
      project_manager: this.addProjectForm.value.projectManager,
      project_client: this.addProjectForm.value.projectClient,
      project_status: this.addProjectForm.value.projectStatus || null,
      management_tool: this.addProjectForm.value.manageTool || null,
      management_url: this.addProjectForm.value.manageUrl,
      repo_tool: this.addProjectForm.value.repoTool || null,
      repo_url: this.addProjectForm.value.repoUrl,
      project_start_date: this.addProjectForm.value.projectStartDate,
      project_deadline_date: this.addProjectForm.value.projectDeadlineDate,
      project_budget: this.addProjectForm.value.projectBudget,
      project_priority: this.addProjectForm.value.projectPriority,
      project_location: this.addProjectForm.value.projectLocation,
      project_type: this.addProjectForm.value.projectType,
      project_approval_status: this.addProjectForm.value.projectApproveStatus,
    };

    this.userService.createProject(data).subscribe({
      next: (res: any) => {
        if (res.status) {
          res.data = this.project;
          this.router.navigate(['/home']);
          this.toastr.success('Project created suceesfully');
        }
      },
      error: (err) => {
        this.toastr.error(err.error.message);
      },
    });
  }
}
