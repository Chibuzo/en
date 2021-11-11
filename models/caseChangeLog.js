'use strict';

module.exports = (sequelize, DataTypes) => {
    const CaseChangeLog = sequelize.define('CaseChangeLog', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        case_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        status_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        changed_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    CaseChangeLog.associate = function (models) {

    };

    return CaseChangeLog;
}