export const groupBy = (data, key) => {
    const grouped = data.reduce((acc, item) => {
      const groupKey = item[key];
      if (!acc[groupKey]) {
        acc[groupKey] = { name: groupKey, quantidade: 0, valor_total: 0, items: [] };
      }
      acc[groupKey].quantidade += item.quantidade;
      acc[groupKey].valor_total += item.valor_total;
      acc[groupKey].items.push(item);
      return acc;
    }, {});
  
    return Object.values(grouped);
  };
  
  export const calculateTotals = (data) => {
    return data.reduce(
      (totals, item) => {
        totals.quantidade += item.quantidade;
        totals.valor_total += item.valor_total;
        return totals;
      },
      { quantidade: 0, valor_total: 0 }
    );
  };
  