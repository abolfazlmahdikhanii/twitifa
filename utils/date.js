import { format } from "date-fns-jalali";


export const formatPersianDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
   year: "numeric",
   month: "2-digit",
   day: "2-digit",
  }).format(new Date(date));
};

export const formatDate = (date) => {
  if (!date) return "";
  return format(date,"dd MMMM yyyy")
};
export const formatTime = (time) => {
  if (!time) return "";
  return format(time,"HH:MM")
};
