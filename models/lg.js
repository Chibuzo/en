'use strict';

module.exports = (sequelize, DataTypes) => {
    const Lg = sequelize.define('Lg', {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        lid: {
            type: DataTypes.INTEGER
        }
    }, { sequelize, timestamps: false });

    Lg.associate = function (models) {
        Lg.hasMany(models.Ward, { as: 'wards', foreignKey: 'lg_id' });
        Lg.belongsTo(models.State, { foreignKey: 'state_id' });
    };

    return Lg;
}