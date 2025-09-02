 // Adds $ sign and commas for diplay purposes
 export const formatDisplayCurrency = (amount) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount || 0);
  };

// Adds commas ONLY, no dollar sign (for use in form data)
export const formatFormCurrency = (amount) => {
        const rawValue = amount.replace(/[^0-9.]/g, "");

      // Split into integer and decimal
      const [integer, decimal] = rawValue.split(".");
      const formattedInteger = (integer || "0").replace(/^0+(?!$)/, "");
      const withCommas = parseInt(formattedInteger || "0").toLocaleString();

      // Recombine with decimal (if any)
      const formatted = decimal !== undefined ? `${withCommas}.${decimal.slice(0, 2)}` : withCommas;
      return formatted;
}