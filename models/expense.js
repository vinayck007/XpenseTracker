const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  amount: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category: {
    type: Sequelize.ENUM('food', 'fuel', 'travel', 'entertainment'),
    allowNull: false
  }
});

module.exports = Expense;