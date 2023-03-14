'use strict';

module.exports = (sequelize, DataTypes) => {
    const Ward = sequelize.define('Ward', {
        name: {
            type: DataTypes.STRING(80),
            allowNull: false
        },
        wid: {
            type: DataTypes.INTEGER
        },
        result_sheet: {
            type: DataTypes.STRING
        },
        total_accredited_voters: {
            type: DataTypes.INTEGER
        },
        total_valid_votes: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        tableName: 'wards',
        timestamps: true
    });

    Ward.associate = function (models) {
        Ward.belongsTo(models.State, { foreignKey: 'state_id' });
        Ward.belongsTo(models.Lg, { as: 'lg', foreignKey: 'lg_id' });
        Ward.hasMany(models.PollingUnit, { as: 'pollingUnits', foreignKey: 'ward_id' });
        Ward.belongsTo(models.Vote, { as: 'vote', foreignKey: 'vote_id' });
        Ward.hasOne(models.User, { foreignKey: 'ward_id' });
    };

    return Ward;
}