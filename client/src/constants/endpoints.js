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
export const FETCH_LGA_NUM_OF_REGISTERED_VOTERS = `${backend}/numRegVoters/lga-num-of-registered-voters`;
export const FETCH_WARD_NUM_OF_REGISTERED_VOTERS = `${backend}/numRegVoters/ward-num-of-registered-voters`;
export const FETCH_STATE_NUM_OF_REGISTERED_VOTERS = `${backend}/numRegVoters/state-num-of-registered-voters`;
export const FETCH_HOACONSTITUENCY_NUM_OF_REGISTERED_VOTERS = `${backend}/numRegVoters/hoaConstituency-num-of-registered-voters`;
export const FETCH_SENETORIAL_NUM_OF_REGISTERED_VOTERS = `${backend}/numRegVoters/senetorial-num-of-registered-voters`;
export const FETCH_HOR_NUM_OF_REGISTERED_VOTERS = `${backend}/numRegVoters/hor-num-of-registered-voters`;
export const FETCH_HISTORY = `${backend}/history/fetch-history`;