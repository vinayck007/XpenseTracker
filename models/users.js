const Sequelize = require('sequelize');
const sequelize = require('../util/database');

//id, name , password, phone number, role

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    email: {
        type:  Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: Sequelize.STRING,
    totalExpense: {
        type: Sequelize.FLOAT,
        defaultValue: 0 
        },
    ispremiumuser: Sequelize.BOOLEAN
})

module.exports = User;
