const mongoose = require('mongoose');
const { MongoDBURI } = require('./../config.json');
module.exports = async () => {
  try {
    await mongoose.connect(MongoDBURI);
    console.log(global.styles.infoColor('✅ Connected to MongoDB'));
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};
