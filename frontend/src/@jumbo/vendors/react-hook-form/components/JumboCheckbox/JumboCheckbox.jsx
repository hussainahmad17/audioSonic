import React from "react";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormControlLabel,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { useJumboForm } from "../../hooks";
import PropTypes from "prop-types";

const JumboCheckbox = ({
  fieldName,
  formControl = true,
  label,
  defaultChecked,
}) => {
  const [selectedItem, setSelectedItem] = React.useState(
    defaultChecked ?? false
  );

  const { setValue, control, errors } = useJumboForm();

  const handleSelect = () => {
    setSelectedItem(!selectedItem);
  };

  React.useEffect(() => {
    setValue(fieldName, selectedItem);
  }, [fieldName, setValue, selectedItem]);

  const inputField = (
    <FormControlLabel
      control={
        <Controller
          name={fieldName}
          render={() => {
            return <Checkbox checked={selectedItem} onChange={handleSelect} />;
          }}
          control={control}
        />
      }
      label={label}
    />
  );

  if (formControl) {
    return (
      <FormControl>
        {inputField}
        {!!errors && errors.hasOwnProperty(fieldName) ? (
          <FormHelperText error>{errors[fieldName]?.message}</FormHelperText>
        ) : (
          ""
        )}
      </FormControl>
    );
  }

  return inputField;
};

export { JumboCheckbox };

JumboCheckbox.propTypes = {
  fieldName: PropTypes.string,
  formControl: PropTypes.bool,
  label: PropTypes.string,
  defaultChecked: PropTypes.bool,
};
