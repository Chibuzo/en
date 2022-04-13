'use strict';

module.exports = (sequelize, DataTypes) => {
    const CaseCategory = sequelize.define('CaseCategory', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, { sequelize, timestamps: false });

    CaseCategory.associate = function (models) {
        CaseCategory.hasMany(models.Case, { as: 'cases' });
    };

    return CaseCategory;
}