import * as mysqlDb from './db-mysql';
import * as jsonDb from './db-json';

const db = process.env.USE_JSON_DB === 'true' ? jsonDb : mysqlDb;

export const getAllProducts = (...args) => db.getAllProducts(...args);
export const getCategories = (...args) => db.getCategories(...args);
export const createProduct = (...args) => db.createProduct(...args);
export const updateProduct = (...args) => db.updateProduct(...args);
export const deleteProduct = (...args) => db.deleteProduct(...args);
export const createOrder = (...args) => db.createOrder(...args);
export const getOrders = (...args) => db.getOrders(...args);
export const getStats = (...args) => db.getStats(...args);
export const getSettings = (...args) => db.getSettings(...args);
export const saveSettings = (...args) => db.saveSettings(...args);
export const getSuki = (...args) => db.getSuki(...args);
export const paySuki = (...args) => db.paySuki(...args);
