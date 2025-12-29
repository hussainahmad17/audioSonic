import React from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useJumboForm } from "../../hooks";
import { Controller } from "react-hook-form";
import PropTypes from "prop-types";

const JumboOutlinedInput = ({
  fieldName,
  formControl = true,
  onChange,
  defaultValue,
  label,
  ...restProps
}) => {
  const { errors, setValue, control } = useJumboForm();

  React.useEffect(() => {
    setValue(fieldName, defaultValue);
  }, [fieldName, setValue, defaultValue]);

  const inputField = (
    <Controller
      control={control}
      name={fieldName}
      defaultValue={defaultValue}
      render={({ field }) => {
        return (
          <>
            <InputLabel error={!!errors[fieldName]} htmlFor="display-name">
              {label}
            </InputLabel>
            <OutlinedInput
              inputRef={field.ref}
              onChange={field.onChange}
              error={!!errors[fieldName]}
              label={label}
              value={field.value === undefined ? "" : field.value}
              {...restProps}
            />
            {!!errors && errors.hasOwnProperty(fieldName) && !field.value ? (
              <FormHelperText>{errors[fieldName]?.message}</FormHelperText>
            ) : (
              ""
            )}
          </>
        );
      }}
    />
  );

  if (formControl) {
    return <FormControl error={!!errors[fieldName]}>{inputField}</FormControl>;
  }

  return inputField;
};

export { JumboOutlinedInput };

JumboOutlinedInput.propTypes = {
  fieldName: PropTypes.string,
  formatControl: PropTypes.bool,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
};
