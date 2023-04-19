const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  totalExpense: {
    type: Sequelize.FLOAT,
    defaultValue: 0 // set the default value to 0
  },
  isPremium: Sequelize.BOOLEAN

});

module.exports = User;