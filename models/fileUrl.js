
const Sequelize = require('sequelize');

const sequelize = require('../utils/db-connection');

const FileURL = sequelize.define('fileurl', {
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = FileURL;