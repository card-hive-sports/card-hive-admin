export const parseCurrency = (value: string): number => {
  if (!value) return 0;
  return Number(value.replace(/[^0-9.-]+/g, ""));
}

export const formatCurrency = (value: number): string => {
  if (isNaN(value)) return "$0.00";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export const computeUserStatus = (isActive: boolean, isDeleted: boolean): string => {
  if (isDeleted) return "inactive";
  if (!isActive) return "suspended";
  return "active";
}

export const firstLetterToUpper = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}