export type FilterFieldType = "select" | "multiSelect" | "date" | "dateRange";

export interface FilterOption {
  id: string | number;
  label: string;
  [key: string]: any; // Additional properties
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: FilterFieldType;
  options?: FilterOption[]; // For select/multiSelect
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  // Custom fetch function (optional)
  fetchOptions?: () => Promise<FilterOption[]>;
}

export interface FilterValues {
  [key: string]: any;
}
