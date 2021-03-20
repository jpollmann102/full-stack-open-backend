require('dotenv').config();

const PORT = process.env.PORT || 3003;
const MONGO_DB_URL = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGO_DB_URL
:
process.env.NODE_ENV === 'production' ?
process.env.PROD_MONGO_DB_URL
:
process.env.DEV_MONGO_DB_URL
;

module.exports = {
  MONGO_DB_URL,
  PORT
}
