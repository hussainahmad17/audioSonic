import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useJumboForm } from "../../hooks";
import PropTypes from "prop-types";

const JumboSelect = ({
  fieldName,
  formControl = true,
  options,
  children,
  label,
  placeholder,
  defaultValue,
  ...restProps
}) => {
  const { errors, setValue, control } = useJumboForm();

  React.useEffect(() => {
    setValue(fieldName, defaultValue);
  }, [fieldName, setValue, defaultValue]);

  const generateSelectOptions = React.useCallback(() => {
    if (Array.isArray(options)) {
      return options?.map((option, index) => (
        <MenuItem key={index} value={option.value}>
          {option.label}
        </MenuItem>
      ));
    }

    return options?.data?.map((option, index) => (
      <MenuItem key={index} value={option[options.labelKey]}>
        {option[options.valueKey]}
      </MenuItem>
    ));
  }, [options]);

  const inputField = (
    <Controller
      control={control}
      name={fieldName}
      render={({ field }) => {
        return (
          <>
            <Select
              onChange={field.onChange}
              label={label}
              value={field.value === undefined ? "" : field.value}
              {...restProps}
            >
              {placeholder && (
                <MenuItem disabled value="">
                  <em>{placeholder}</em>
                </MenuItem>
              )}
              {generateSelectOptions()}
            </Select>
            {!!errors && errors.hasOwnProperty(fieldName) && !field.value ? (
              <FormHelperText>{errors[fieldName]?.message}</FormHelperText>
            ) : (
              ""
            )}
          </>
        );
      }}
      defaultValue={defaultValue}
    />
  );

  if (formControl) {
    return (
      <FormControl variant="outlined" error={!!errors[fieldName]}>
        {label && <InputLabel>{label}</InputLabel>}
        {inputField}
      </FormControl>
    );
  }

  return inputField;
};

export { JumboSelect };

JumboSelect.propTypes = {
  fieldName: PropTypes.string,
  formControl: PropTypes.bool,
  options: PropTypes.any,
  placeholder: PropTypes.string,
  label: PropTypes.string,
};
