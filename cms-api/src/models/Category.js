const Sequelize = require('sequelize');
const sequelize = require('../database/connection');
module.exports = sequelize.define('Category', {
    id:{
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    label: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    description: {
        type: Sequelize.STRING(200)
    },
    createdBy: {
        type: Sequelize.INTEGER(11),
        allowNull: true,
        foreignKey: true
    },
    modifiedBy: {
        type: Sequelize.INTEGER(11),
        foreignKey: true
    },
    createdAt: Sequelize.DATE,
    modifiedAt: Sequelize.DATE
});
