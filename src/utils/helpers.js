export const getCategoryName = (category) => {
  if (!category) return "";
  if (typeof category.name === "string") return category.name;
  if (typeof category.name === "object") {
    return category.name.en || category.name.ja || "";
  }
  return "";
};

export const getCategoryNameJa = (category) => {
  if (!category) return "";
  if (typeof category.name === "object") {
    return category.name.ja || category.name.en || "";
  }
  return category.nameJa || "";
};

/**
 * Format a price with currency symbol using Intl API
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (e.g., 'JPY', 'USD')
 * @returns {string} Formatted price string with currency symbol
 */
export const formatPrice = (amount, currency = "JPY") => {
  const num = parseFloat(amount);
  const locale = currency === "JPY" ? "ja-JP" : "en-US";
  const options = {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "JPY" ? 0 : 2,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  };

  if (isNaN(num)) {
    return new Intl.NumberFormat(locale, options).format(0);
  }
  return new Intl.NumberFormat(locale, options).format(num);
};
