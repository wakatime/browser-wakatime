import { Category, EntityType } from './heartbeats';

export enum KnownSite {
  bitbucket = 'bitbucket',
  canva = 'canva',
  circleci = 'circleci',
  figma = 'figma',
  github = 'github',
  gitlab = 'gitlab',
  googlemeet = 'googlemeet',
  stackoverflow = 'stackoverflow',
  travisci = 'travisci',
  vercel = 'vercel',
  zoom = 'zoom',
}

export interface OptionalHeartbeat {
  branch?: string | null;
  category?: Category | null;
  entity?: string;
  entityType?: EntityType;
  language?: string | null;
  project?: string | null;
}

export type HeartbeatParser = (url: string) => OptionalHeartbeat | undefined;

export interface SiteParser {
  parser: HeartbeatParser;
  urls: RegExp[] | string[];
}

export type StackExchangeSiteState = 'linked_meta' | 'normal' | 'open_beta';

export type StackExchangeSiteType = 'main_site' | 'meta_site';

export type StackExchangeSite = {
  aliases?: string[];
  api_site_parameter: string;
  audience?: string;
  favicon_url: string;
  high_resolution_icon_url: string;
  icon_url: string;
  launch_date?: number;
  logo_url: string;
  name: string;
  site_state: StackExchangeSiteState;
  site_type: StackExchangeSiteType;
  site_url: string;
};
