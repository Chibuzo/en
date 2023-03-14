'use strict';

module.exports = (sequelize, DataTypes) => {
    const Lg = sequelize.define('Lg', {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        result_sheet: {
            type: DataTypes.STRING
        },
        lid: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        timestamps: false,
        tableName: 'lgs'
    });

    Lg.associate = function (models) {
        Lg.hasMany(models.Ward, { as: 'wards', foreignKey: 'lg_id' });
        Lg.belongsTo(models.State, { foreignKey: 'state_id' });
        Lg.belongsTo(models.Vote, { as: 'vote', foreignKey: 'vote_id' });
    };

    return Lg;
}