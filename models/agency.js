'use strict';

module.exports = (sequelize, DataTypes) => {
    const Agency = sequelize.define('Agency', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        abbr: {
            type: DataTypes.STRING
        }
    }, { sequelize, timestamps: false });

    Agency.associate = function (models) {
        Agency.hasMany(models.Case, { as: 'cases' });
    };

    return Agency;
}