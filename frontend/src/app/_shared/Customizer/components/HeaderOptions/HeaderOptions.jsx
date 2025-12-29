import { JumboCard } from "@jumbo/components";
import { useJumboLayout } from "@jumbo/components/JumboLayout/hooks";
import { Div } from "@jumbo/shared";
import { FormControlLabel, Switch, Typography } from "@mui/material";

const HeaderOptions = () => {
  const { headerOptions, setHeaderOptions } = useJumboLayout();

  const handleHeaderPosition = (event) => {
    setHeaderOptions({ fixed: event.target.checked });
  };

  return (
    <JumboCard
      title={
        <Typography variant={"h5"} mb={0}>
          Header Options
        </Typography>
      }
      headerSx={{
        borderBottom: 1,
        borderColor: "divider",
      }}
      contentWrapper
    >
      <Div>
        <FormControlLabel
          control={
            <Switch
              checked={headerOptions.fixed}
              onChange={handleHeaderPosition}
              name="header-fixed"
            />
          }
          label="Header Fixed"
        />
      </Div>
    </JumboCard>
  );
};

export { HeaderOptions };
