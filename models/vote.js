'use strict';

module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
        parties: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        vote_level: {
            type: DataTypes.STRING(10)
        },
        vote_level_id: {
            type: DataTypes.INTEGER
        }
    }, { sequelize, timestamps: true });

    Vote.associate = function (models) {
        Vote.hasOne(models.PollingUnit, { foreignKey: 'vote_id' });
        Vote.hasOne(models.Ward, { foreignKey: 'vote_id' });
        Vote.hasOne(models.Lg, { foreignKey: 'vote_id' });
    };

    return Vote;
}