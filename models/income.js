const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//id, name , password, phone number, role

const Income = sequelize.define('incomes', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    incomeamount: Sequelize.INTEGER
  })
    

module.exports = Income;