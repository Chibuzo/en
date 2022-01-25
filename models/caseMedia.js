'use strict';

module.exports = (sequelize, DataTypes) => {
    const CaseMedia = sequelize.define('CaseMedia', {
        media_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        case_update_id: {
            type: DataTypes.INTEGER,
        },
    });

    CaseMedia.associate = function (models) {
        CaseMedia.belongsTo(models.Case);
    };

    return CaseMedia;
}