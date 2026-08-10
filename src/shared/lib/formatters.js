const numberFormatter = new Intl.NumberFormat("en-US");

export function formatNumber(value, options) {
  if (value === null || value === undefined || value === "") return "0";

  return options
    ? new Intl.NumberFormat("en-US", options).format(Number(value))
    : numberFormatter.format(Number(value));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value ?? 0);
}

export function formatCategory(value = "") {
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getInitials(firstName = "", lastName = "") {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";
}
