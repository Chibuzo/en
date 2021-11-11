'use strict';

module.exports = (sequelize, DataTypes) => {
    const CaseStatus = sequelize.define('CaseStatus', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    CaseStatus.associate = function (models) {

    };

    return CaseStatus;
}