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
        location: DataTypes.STRING,
        event_date: DataTypes.DATE,
        victim: {
            type: DataTypes.STRING
        },
        culprit: {
            type: DataTypes.STRING
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'new'
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    Case.associate = function (models) {
        Case.belongsTo(models.Admin);
        Case.belongsTo(models.CaseCategory);
        Case.belongsTo(models.Agency);
        Case.hasMany(models.CaseMedia, { as: 'media' });
    };

    return Case;
}