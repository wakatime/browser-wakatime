export interface Heartbeat {
  branch?: string | null;
  category?: Category | null;
  entity: string;
  entityType: EntityType;
  language?: string | null;
  project?: string | null;
}

export enum Category {
  browsing = 'browsing',
  code_reviewing = 'code reviewing',
  coding = 'coding',
  debugging = 'debugging',
  designing = 'designing',
  meeting = 'meeting',
}

export enum EntityType {
  app = 'app',
  domain = 'domain',
  file = 'file',
  url = 'url',
}

export interface ProjectDetails {
  [key: string]: string;
  category: string;
  editor: string;
  language: string;
  project: string;
}

export interface PostHeartbeatMessage {
  projectDetails?: ProjectDetails;
  recordHeartbeat: boolean;
}
