export function formatDateFromSeconds(seconds) {
  const date = new Date(seconds * 1000); // convert seconds → ms

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}