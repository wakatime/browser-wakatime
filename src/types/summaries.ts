export interface Summaries {
  data: Summary[];
  end: string;
  start: string;
}

interface Summary {
  categories: Category[];
  dependencies: Category[];
  editors: Category[];
  grand_total: GrandTotal;
  languages: Category[];
  machines: Category[];
  operating_systems: Category[];
  projects: Category[];
  range: Range;
}

interface Category {
  digital: string;
  hours: number;
  machine_name_id?: string;
  minutes: number;
  name: string;
  percent: number;
  seconds: number;
  text: string;
  total_seconds: number;
}

export interface GrandTotal {
  digital: string;
  hours: number;
  minutes: number;
  text: string;
  total_seconds: number;
}

interface Range {
  date: string;
  end: string;
  start: string;
  text: string;
  timezone: string;
}
