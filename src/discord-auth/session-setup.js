const session = require('express-session');
const MongoStore = require('connect-mongo'); 

module.exports = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, 
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), 
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 } 
});
