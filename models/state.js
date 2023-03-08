'use strict';

module.exports = (sequelize, DataTypes) => {
    const State = sequelize.define('State', {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, { sequelize, timestamps: false });

    State.associate = function (models) {
        State.hasMany(models.Lg, { as: 'lgs', foreignKey: 'state_id' });
        State.hasMany(models.Ward, { as: 'wards', foreignKey: 'state_id' });
    };

    return State;
}