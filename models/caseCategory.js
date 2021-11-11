'use strict';

module.exports = (sequelize, DataTypes) => {
    const CaseCategory = sequelize.define('CaseCategory', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    CaseCategory.associate = function (models) {

    };

    return CaseCategory;
}