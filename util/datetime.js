export function formatDate(date) {
  const dateTime = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}.${date.getMilliseconds()}`;

  return dateTime;
}

export function getDate(date) {
  const fullDate = date.split(" ");
  return fullDate[0];
}

export function formatDateForLabels(date) {
  const items = date.split("-");
  const newFormat = `${items[2]}/${items[1]}/${items[0].slice(-2)}`;

  return newFormat;
}
