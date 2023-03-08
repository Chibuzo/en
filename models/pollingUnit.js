'use strict';

module.exports = (sequelize, DataTypes) => {
    const PollingUnit = sequelize.define('PollingUnit', {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        result_sheet: {
            type: DataTypes.STRING
        },
        delimiter: {
            type: DataTypes.STRING(20)
        },
        total_accredited_voters: {
            type: DataTypes.INTEGER
        },
        total_valid_votes: {
            type: DataTypes.INTEGER
        }
    }, { sequelize, timestamps: true });

    PollingUnit.associate = function (models) {
        PollingUnit.belongsTo(models.Ward, { as: 'ward', foreignKey: 'ward_id' });
        PollingUnit.belongsTo(models.Vote, { as: 'vote', foreignKey: 'vote_id' });
        PollingUnit.hasOne(models.User, { foreignKey: 'pu_id' });
    };

    return PollingUnit;
}