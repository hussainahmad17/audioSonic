import moment from "moment";
import { USE_IMAGE_PLACEHOLDERS } from "../constants/paths";

export const getCustomDateTime = (
  value = 0,
  unit = "days",
  format = "HH:mm a | MMMM DD, YYYY"
) => {
  if (value === 0) {
    return moment().format(format);
  } else {
    return moment().add(value, unit).format(format);
  }
};

export const getDateElements = (date) => {
  const dateString = moment(date).format("dddd, MMMM DD YYYY, hh:mm A");
  const dateSections = dateString.split(",");
  const day = dateSections[0];
  const time = dateSections[2];
  const datePart = dateSections[1].trim().split(" ");
  return {
    day,
    time,
    date: {
      dateString: dateSections[1],
      month: datePart[0],
      date: datePart[1],
      year: datePart[2],
    },
  };
};

export const getAssetPath = (url, size) => {
  if (USE_IMAGE_PLACEHOLDERS) {
    return `https://via.placeholder.com/${size}.png`;
  }

  return url;
};
