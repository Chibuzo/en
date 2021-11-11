'use strict';

module.exports = (sequelize, DataTypes) => {
    const Case = sequelize.define('Case', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        victim: {
            type: DataTypes.STRING
        },
        culprit: {
            type: DataTypes.STRING
        },
        category_id: {
            type: DataTypes.INTEGER
        },
        status_id: {
            type: DataTypes.INTEGER
        },
        added_by: {
            type: DataTypes.INTEGER
        }
    });

    Case.associate = function (models) {

    };

    return Case;
}