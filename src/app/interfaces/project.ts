export interface projectList {
  management_tool: string;
  management_url: string;
  project_approval_status: string;
  project_budget: number;
  project_client: string;
  project_created_at: string;
  project_deadlineDate: string;
  project_description: string;
  project_id: number;
  project_lead: string;
  project_location: string;
  project_manager: string;
  project_milestone_release_date: string;
  project_name: string;
  project_priority: string;
  project_startDate: string;
  project_status: string;
  project_tech: string;
  project_type: string;
  project_user_id: number;
  repo_tool: string;
  repo_url: string;
}

export interface Option {
  value: string;
  display: string;
}