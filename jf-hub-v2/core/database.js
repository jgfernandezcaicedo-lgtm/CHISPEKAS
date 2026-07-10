// JF Hub Data Layer
// Central access point for business data.

export const DataStore = {
  businesses: [],
  products: [],
  clients: [],
  operations: [],

  add(collection, item) {
    if (!this[collection]) this[collection] = [];
    this[collection].push(item);
  },

  get(collection) {
    return this[collection] || [];
  }
};
