import React, { ChangeEvent } from "react";
import { enUS, frFR, arEG, zhCN, esES, itIT } from "@mui/material/locale";
import { useTranslation } from "react-i18next";
import { JumboCard } from "@jumbo/components";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import { FormControlLabel, Switch, Typography } from "@mui/material";
import { Div } from "@jumbo/shared";
import { JumboForm, JumboSelect } from "@jumbo/vendors/react-hook-form";

const languages = [
  {
    label: "English",
    locale: "en-US",
    muiLocale: enUS,
  },
  {
    label: "French",
    locale: "fr-FR",
    muiLocale: frFR,
  },
  {
    label: "Arabic",
    locale: "ar-EG",
    muiLocale: arEG,
  },
  {
    label: "Chinese",
    locale: "zh-CN",
    muiLocale: zhCN,
  },
  {
    label: "Spanish",
    locale: "es-ES",
    muiLocale: esES,
  },
  {
    label: "Italian",
    locale: "it-IT",
    muiLocale: itIT,
  },
];

const languagesOption = {
  labelKey: "locale",
  valueKey: "label",
  data: languages,
};

const LocalizationOptions = () => {
  const { i18n } = useTranslation();
  const { theme, setMuiLocale, setTheme } = useJumboTheme();
  const [activeLocale, setActiveLocale] = React.useState(languages[0]);

  const handleChange = (event) => {
    const localeIndex = languages.findIndex(
      (language) => language.locale === event.target.value
    );
    if (localeIndex !== -1) {
      i18n.changeLanguage(languages[localeIndex].locale).then(() => {
        setActiveLocale(languages[localeIndex]);
        setMuiLocale(languages[localeIndex].muiLocale);
      });
    }
  };

  const changeDirection = (event) => {
    const newDirection = event.target.checked ? "rtl" : "ltr";
    setTheme({ direction: newDirection });
    document.querySelector("body")?.setAttribute("dir", newDirection);
  };

  return (
    <JumboCard
      title={
        <Typography variant={"h5"} mb={0}>
          Localization
        </Typography>
      }
      headerSx={{
        borderBottom: 1,
        borderColor: "divider",
      }}
      contentWrapper
    >
      <JumboForm>
        <JumboSelect
          fieldName="languages"
          options={languagesOption}
          sx={{ width: "180px" }}
          size={"small"}
          label={"Select Locale"}
          onChange={handleChange}
          value={activeLocale.locale}
        />
      </JumboForm>
      <Div sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={theme.direction === "rtl"}
              onChange={changeDirection}
              name="localization-change-direction"
            />
          }
          label="Switch to RTL"
        />
      </Div>
    </JumboCard>
  );
};

export { LocalizationOptions };
