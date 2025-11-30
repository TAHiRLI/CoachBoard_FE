import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { ReactNode, useState } from "react";

import { Add } from "@mui/icons-material";
import CustomModal from "@/components/customModal/customModal";

interface AutocompleteWithAddProps<T> {
  options: T[];
  value?: T | null;
  label: string;
  getOptionLabel: (option: T) => string;
  onChange: (value: T | null) => void;
  error?: boolean;
  helperText?: string | undefined;
  addButtonText?: string;
  renderAddForm: (onSuccess: () => void, onCancel: () => void) => ReactNode;
  onItemAdded?: () => void;
}

function AutocompleteWithAdd<T>({
  options,
  value,
  label,
  getOptionLabel,
  onChange,
  error,
  helperText,
  addButtonText = "Add New",
  renderAddForm,
  onItemAdded,
}: AutocompleteWithAddProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSuccess = () => {
    setIsModalOpen(false);
    onItemAdded?.();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Autocomplete
        options={options}
        value={value}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        getOptionLabel={getOptionLabel}
        onChange={(_, newValue) => {
          onChange(newValue);
        }}
        isOptionEqualToValue={(option, value) => 
          JSON.stringify(option) === JSON.stringify(value)
        }
        renderOption={(props, option) => {
          const { key, ...restProps } = props as any;
          return (
            <li key={key} {...restProps}>
              {getOptionLabel(option)}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={error}
            helperText={helperText}
          />
        )}
        noOptionsText={
          <Box
            onClick={() => setIsModalOpen(true)}
            sx={{
              cursor: "pointer",
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Add fontSize="small" />
              <Typography variant="body2">{addButtonText}</Typography>
            </Box>
          </Box>
        }
      />

      <CustomModal open={isModalOpen} setOpen={setIsModalOpen}>
        {renderAddForm(handleSuccess, handleCancel)}
      </CustomModal>
    </>
  );
}

export default AutocompleteWithAdd;