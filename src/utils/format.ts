const currency = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

export const formatCurrency = (val: number | string) => currency.format(+val);
