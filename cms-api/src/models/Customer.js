const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
module.exports = sequelize.define('Customer', {
    id:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true     
    },
    categoryId: {
        type: Sequelize.INTEGER(11),
        foreignKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(300)
    },
    phone: {
        type: Sequelize.STRING(15),
        allowNull: true
    },
    address: {
        type: Sequelize.STRING(200),
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    createdBy: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        foreignKey: true 
    },
    modifiedBy: {
        type: Sequelize.INTEGER(11),
        foreignKey: true 
    },
    createdAt: Sequelize.DATE,
    modifiedAt: Sequelize.DATE
});
