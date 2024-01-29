const mongoose = require('mongoose');
require('dotenv').config();

const dbUrl = process.env.DB_URL;

main();
async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log('db connected');
  } catch (err) {
    console.log(err);
  }
}
