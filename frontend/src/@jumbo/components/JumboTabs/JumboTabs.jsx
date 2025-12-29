import { Button, Stack } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";
function JumboTabs({
  items,
  primaryKey = "key",
  labelKey = "label",
  defaultValue,
  sx,
  onChange,
}) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  const handleTabClick = React.useCallback(
    (item) => {
      setActiveTab(item);
      onChange(item);
    },
    [onChange]
  );

  return (
    <Stack direction={"row"} spacing={1} sx={sx}>
      {items.map((item, index) => {
        return (
          <Button
            key={index}
            size={"small"}
            variant={
              activeTab && item[primaryKey] === activeTab[primaryKey]
                ? "contained"
                : "outlined"
            }
            onClick={() => handleTabClick(item)}
          >
            {item[labelKey]}
          </Button>
        );
      })}
    </Stack>
  );
}

export { JumboTabs };

JumboTabs.propTypes = {
  items: PropTypes.array.isRequired,
  primaryKey: PropTypes.string,
  labelKey: PropTypes.string,
  defaultValue: PropTypes.any,
  sx: PropTypes.object,
  onChange: PropTypes.func, // Assuming onChange takes an `item` parameter and returns any
};
