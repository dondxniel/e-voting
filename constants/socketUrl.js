export const socketUrl = (process.env.NODE_ENV === 'production') ? 'https://secret-tor-68442.herokuapp.com' : ((process.env.NODE_ENV === 'development') ? 'http://localhost:3000' : null);
