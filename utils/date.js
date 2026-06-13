

export const formatPersianDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
   year: "numeric",
   month: "2-digit",
   day: "2-digit",
  }).format(new Date(date));
};
