const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const DownloadedFile = sequelize.define('downloaded_file', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: Sequelize.INTEGER,
  file_name: Sequelize.STRING,
  date_downloaded: Sequelize.DATE
});

module.exports = DownloadedFile;