// JF Hub Dashboard
// Aggregates information from business modules

export function getDashboardSummary(data = {}) {
  return {
    income: data.income || 0,
    businesses: data.businesses || []
  };
}
