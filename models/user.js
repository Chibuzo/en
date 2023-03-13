'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        fullname: {
            type: DataTypes.STRING(60)
        },
        email: {
            type: DataTypes.STRING(60)
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        role: {
            type: DataTypes.STRING(10)
        },
        password: DataTypes.STRING(100),
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: true,
        indexes: [
            { unique: true, fields: ['username'] }
        ]
    });

    User.associate = function (models) {
        User.belongsTo(models.Lg, { foreignKey: 'lg_id' });
        User.belongsTo(models.Ward, { foreignKey: 'ward_id' });
        User.belongsTo(models.PollingUnit, { foreignKey: 'pu_id' });
    };

    return User;
}