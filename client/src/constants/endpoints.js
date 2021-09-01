const backend = (process.env.NODE_ENV === 'production') ? '' : ((process.env.NODE_ENV === 'development') ? 'http://localhost:5000' : null);

export const CREATE_ADMIN_ROUTE = `${backend}/admin/create-admin/`;
export const FETCH_ADMINS_ROUTE = `${backend}/admin/fetch-admins/`;
export const FETCH_STATES_ROUTE = `${backend}/json/fetch-states/`;
export const ADD_PARTY_ROUTE = `${backend}/parties/add-party/`;
export const FETCH_PARTIES_ROUTE = `${backend}/parties/fetch-parties/`;
export const START_ELECTION_ROUTE = `${backend}/election/start-election/`;
export const LOGIN_ROUTE = `${backend}/auth/login/`;
export const REGISTER_VOTER = `${backend}/voter/register-voter/`;
export const FETCH_ELECTION_STATS = `${backend}/election/fetch-election-stats/`;