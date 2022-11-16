const API_PATHS = {
  auth: {
    base: '/auth',
    login: '/login',
    signup: '/signup',
  },
  expenses: {
    base: '/expenses',
    createExpense: '/',
    getExpensesByUserId: '/',
    updateExpense: '/:expenseId',
    deleteExpense: '/:expenseId',
  },
  users: {
    base: '/user',
    getUserProfile: '/',
    updateUserProfile: '/',
  },
  notes: {
    base: '/notes',
    createNote: '/',
    getNotesByUserId: '/',
    updateNote: '/:noteId',
    deleteNote: '/:noteId',
  },
  accounts: {
    base: '/accounts',
    createAccount: '/',
    getAccountsByUserId: '/',
    updateAccount: '/:accountId',
    deleteAccount: '/:accountId',
  },
};

const environments = {
  DEVELOPMENT: 'DEVELOPMENT',
  STAGING: 'STAGING',
  PRODUCTION: 'PRODUCTION',
};

const createPath = (basePath: string, path: string) => `${basePath}${path}`;
const createApiPath = (path: string) => `/api${path}`;
export default API_PATHS;
export { createPath, createApiPath, environments };
