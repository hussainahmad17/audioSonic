import React from "react";
import { Popover, FormControl } from "@mui/material";
import { SketchPicker } from "react-color";
import { useJumboForm } from "../../hooks";
import { Controller } from "react-hook-form";
import { Div } from "@jumbo/shared";

const JumboColorPickerField = ({
  fieldName,
  formControl = true,
  onChange,
  defaultValue,
  className,
}) => {
  const { setValue, control } = useJumboForm();
  const [anchorEl, setAnchorEl] = React.useState(null);

  React.useEffect(() => {
    setValue(fieldName, defaultValue || "");
  }, [fieldName, setValue, defaultValue]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onColorSelect = (color) => {
    setValue(fieldName, color.hex);
    if (onChange) {
      onChange(color.hex);
    }
  };

  const id = open ? "simple-popover" : undefined;

  const colorPickerField = (
    <Controller
      control={control}
      name={fieldName}
      defaultValue={defaultValue || ""}
      render={({ field }) => (
        <Div
          sx={{
            border: 1,
            borderColor: "primary.main",
            p: 0.5,
            display: "flex",
            flex: 1,
            minWidth: 40,
            minHeight: 38,
            cursor: "pointer",
          }}
        >
          <Div
            onClick={handleClick}
            sx={{ flex: 1, p: 1, bgcolor: field.value || defaultValue }}
          />
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <SketchPicker
              color={field.value || defaultValue}
              onChange={onColorSelect}
            />
          </Popover>
        </Div>
      )}
    />
  );

  if (formControl) {
    return <FormControl className={className}>{colorPickerField}</FormControl>;
  }

  return colorPickerField;
};

export { JumboColorPickerField };
