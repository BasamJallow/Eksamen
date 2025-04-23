const dotenv = require('dotenv');

if(process.env.NODE_ENV === 'development') {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
}

const server = "gruppe22server.database.windows.net";
const database = "Gruppe22Prog";
const port = 1433;
const user = "gruppe22server";
const password = "Ytd95exd";

const passwordConfig = {
  server,
  port,
  database,
  user,
  password,
  options: {
    encrypt: true
  }
};

module.exports = passwordConfig