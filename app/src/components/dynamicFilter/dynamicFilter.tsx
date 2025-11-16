import { Autocomplete, Box, Button, Chip, Collapse, IconButton, TextField, Typography } from "@mui/material";
import { Close, FilterList, RestartAlt, Save } from "@mui/icons-material";
import { FilterFieldConfig, FilterOption, FilterValues } from "@/lib/types/dynamicFilter.types";
import { useEffect, useState } from "react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useTranslation } from "react-i18next";

export interface DynamicFilterProps {
  fields: FilterFieldConfig[];
  onChange: (values: FilterValues) => void;
  onReset?: () => void;
  initialValues?: FilterValues;
  showResetButton?: boolean;
  showFilterCount?: boolean;
  collapsible?: boolean;
  compact?: boolean;
  autoApply?: boolean;
}

const DynamicFilter: React.FC<DynamicFilterProps> = ({
  fields,
  onChange,
  onReset,
  initialValues = {},
  showResetButton = true,
  showFilterCount = true,
  collapsible = false,
  compact = false,
  autoApply = false,
}) => {
  const { t } = useTranslation();
  const [filterValues, setFilterValues] = useState<FilterValues>(initialValues);
  const [fieldOptions, setFieldOptions] = useState<Record<string, FilterOption[]>>({});
  const [expanded, setExpanded] = useState(!collapsible);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initializeOptions = async () => {
      const newOptions: Record<string, FilterOption[]> = {};
      const loadingStates: Record<string, boolean> = {};

      for (const field of fields) {
        if (field.fetchOptions) {
          loadingStates[field.key] = true;
          setLoading((prev) => ({ ...prev, [field.key]: true }));

          try {
            const options = await field.fetchOptions();
            newOptions[field.key] = options;
          } catch (error) {
            console.error(`Failed to fetch options for ${field.key}:`, error);
            newOptions[field.key] = [];
          } finally {
            loadingStates[field.key] = false;
          }
        } else if (field.options) {
          newOptions[field.key] = field.options;
        }
      }

      setFieldOptions(newOptions);
      setLoading(loadingStates);
    };

    initializeOptions();
  }, [fields]);

  // Notify parent of changes
  useEffect(() => {
    if (autoApply) onChange(filterValues);
  }, [filterValues]);

  const handleFilterChange = (key: string, value: any) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    const emptyValues: FilterValues = {};
    fields.forEach((field) => {
      if (field.type === "multiSelect") {
        emptyValues[field.key] = [];
      } else {
        emptyValues[field.key] = null;
      }
    });

    setFilterValues(emptyValues);
    onReset?.();
  };

  const getActiveFilterCount = () => {
    return Object.entries(filterValues).filter(([_, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== "";
    }).length;
  };

  const renderField = (field: FilterFieldConfig) => {
    const options = fieldOptions[field.key] || [];
    const isLoading = loading[field.key] || false;

    switch (field.type) {
      case "select":
        return (
          <Autocomplete
            key={field.key}
            options={options}
            loading={isLoading}
            disabled={field.disabled}
            value={filterValues[field.key] || null}
            onChange={(_, newValue) => handleFilterChange(field.key, newValue)}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                size={compact ? "small" : "medium"}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.label}
              </li>
            )}
          />
        );

      case "multiSelect":
        return (
          <Autocomplete
            key={field.key}
            multiple
            options={options}
            loading={isLoading}
            disabled={field.disabled}
            value={filterValues[field.key] || []}
            onChange={(_, newValue) => handleFilterChange(field.key, newValue)}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                size={compact ? "small" : "medium"}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option.label} {...getTagProps({ index })} key={option.id} size="small" />
              ))
            }
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {option.label}
              </li>
            )}
          />
        );

      case "date":
        return (
          <DatePicker
            key={field.key}
            label={field.label}
            value={filterValues[field.key] || null}
            onChange={(newValue) => handleFilterChange(field.key, newValue)}
            disabled={field.disabled}
            slotProps={{
              textField: {
                size: compact ? "small" : "medium",
                required: field.required,
                placeholder: field.placeholder,
              },
            }}
          />
        );

      case "dateRange":
        return (
          <div className="flex flex-col gap-5" key={`${field.key}`}>
            <DatePicker
              label={`${field.label} (${t("static.from")})`}
              value={filterValues[`${field.key}_from`] || null}
              onChange={(newValue) => handleFilterChange(`${field.key}_from`, newValue)}
              disabled={field.disabled}
              slotProps={{
                textField: {
                  size: compact ? "small" : "medium",
                  sx: { flex: 1 },
                },
              }}
            />

            <DatePicker
              label={`${field.label} (${t("static.to")})`}
              value={filterValues[`${field.key}_to`] || null}
              onChange={(newValue) => handleFilterChange(`${field.key}_to`, newValue)}
              disabled={field.disabled}
              slotProps={{
                textField: {
                  size: compact ? "small" : "medium",
                  sx: { flex: 1 },
                },
              }}
            />
          </div>
        );

      default:
        return null;
    }
  };
  const activeFilterCount = getActiveFilterCount();

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>
        {/* Header */}

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: collapsible ? 2 : 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0 }}>
            <FilterList color="action" />
            <Typography className="ms-2 block" variant="h6" component="h4" sx={{ fontWeight: 600 }}>
              {t("static.filters")}
            </Typography>
            {showFilterCount && activeFilterCount > 0 && (
              <Chip label={activeFilterCount} size="small" color="primary" sx={{ ml: 1 }} />
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {showResetButton && activeFilterCount > 0 && (
              <Button
                className="text-nowrap"
                startIcon={<RestartAlt />}
                onClick={handleReset}
                size="small"
                variant="outlined"
                color="error"
              >
                {t("static.reset")}
              </Button>
            )}

            {collapsible && (
              <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                {expanded ? <Close /> : <FilterList />}
              </IconButton>
            )}
          </Box>
        </Box>

        <Collapse in={expanded} timeout="auto">
          <div className=" flex flex-col gap-5 mt-5">{fields.map((field) => renderField(field))}</div>

          {/* Active Filters Summary */}
          {showFilterCount && activeFilterCount > 0 && (
            <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block" }}>
                {t("static.activeFilters")}
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {Object.entries(filterValues).map(([key, value]) => {
                  const field = fields.find((f) => f.key === key || key.startsWith(f.key));
                  if (!field) return null;

                  let displayValue: string | null = null;

                  if (Array.isArray(value) && value.length > 0) {
                    displayValue = `${value.length} ${t("static.selected")}`;
                  } else if (value && !Array.isArray(value)) {
                    if (value instanceof Date) {
                      displayValue = value.toLocaleDateString();
                    } else if (typeof value === "object" && value.label) {
                      displayValue = value.label;
                    } else if (typeof value === "string" || typeof value === "number") {
                      displayValue = String(value);
                    }
                  }

                  if (!displayValue) return null;

                  return (
                    <Chip
                      key={key}
                      label={`${field.label}: ${displayValue}`}
                      size="small"
                      onDelete={() => {
                        if (Array.isArray(filterValues[key])) {
                          handleFilterChange(key, []);
                        } else {
                          handleFilterChange(key, null);
                        }
                      }}
                      sx={{
                        backgroundColor: "primary.50",
                        "& .MuiChip-deleteIcon": {
                          color: "primary.main",
                        },
                      }}
                    />
                  );
                })}
                {!autoApply && (
                  <div className="mt-5 w-full flex justify-end">
                    <Button onClick={() => onChange(filterValues)} startIcon={<Save />} variant="outlined">
                      {t("static.apply")}
                    </Button>
                  </div>
                )}
              </Box>

              {/* Filter Fields */}
            </Box>
          )}
        </Collapse>
      </div>
    </LocalizationProvider>
  );
};

export default DynamicFilter;
