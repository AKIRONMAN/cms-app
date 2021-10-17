const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
module.exports = sequelize.define('User', {
    id:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true     
    },
    firstName: {
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(300),
        unique: true,
        allowNull: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    canDelete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    userProfile: {
        type: Sequelize.ENUM,
        values: ['ADMIN', 'USER', 'DELETED', 'ENGINEER'],
        defaultValue: ['ADMIN']
    },
    phone: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    accessToken: {
        type: Sequelize.STRING(200),
        allowNull: true,
        defaultValue: null
    },
    about: {
        type: Sequelize.STRING(200),
        allowNull: true,
        defaultValue: null
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
    loginAt: {
        type: Sequelize.DATE
    },
    createdAt: Sequelize.DATE,
    modifiedAt: Sequelize.DATE
});
