export interface ChecklistProcess {
    pid: string;
    process: string;
    metric: string;
    processChecks: string;
  }
  
  export interface TestableCriteria {
    testableCriteria: string;
    processes: ChecklistProcess[];
  }
  
  export interface ChecklistSection {
    section: string;
    testType: string;
    checklist: TestableCriteria[];
  }
  
  export interface ChecklistConfig {
    principle: string;
    description: string;
    sections: ChecklistSection[];
    summaryYes: string;
    summaryNotYes: string;
    recommendation: string;
  }
  
  export interface ChecklistMeta {
    cid: string;
    name: string;
    description: string;
    group: string;
    width: string;
  }
  
  export interface ChecklistSummary {
    getTotal: (data: any) => number;
    getCompleted: (data: any) => number;
    summary: (data: any) => string;
    progress: (data: any) => number;
    validate: (data: any) => boolean;
  }
  
  export interface ChecklistInputProps {
    config: ChecklistConfig;
    data: ChecklistData;
    onChangeData: (updatedData: ChecklistData) => void;
  }
  
  export interface ChecklistHeaderProps {
    config: ChecklistConfig;
    data: ChecklistData;
  }
  
  /**
   * Represents the data submitted or retrieved for a checklist.
   */
  export interface ChecklistData {
    [key: string]: string | number | undefined; // Represents fields like "completed-2.1.1" and "elaboration-2.1.1"
  }
  
  /**
   * API payload for submitting a checklist.
   */
  export interface PostChecklistRequest {
    cid: string; // Checklist identifier
    data: ChecklistData; // Data submitted for the checklist
    gid: string; // Group ID
    name: string; // Checklist name
  }
  
  /**
   * API response for retrieving a checklist.
   */
  export interface GetChecklistResponse {
    gid: string; // Group ID
    cid: string; // Checklist identifier
    name: string; // Checklist name
    data: ChecklistData; // Retrieved checklist data
    id: number; // Unique ID in the database
    created_at: string; // Timestamp for creation
    updated_at: string; // Timestamp for last update
  }
  
  /**
   * Represents the API service interface for interacting with checklists.
   */
  export interface ChecklistApiService {
    postChecklist: (payload: PostChecklistRequest) => Promise<void>;
    getChecklist: (cid: string) => Promise<GetChecklistResponse>;
  }
  