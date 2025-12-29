import React from "react";
import JumboFormContext from "../components/JumboForm/JumboFormContext";

export const useJumboForm = () => {
  return React.useContext(JumboFormContext);
};
