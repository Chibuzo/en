'use strict';

module.exports = (sequelize, DataTypes) => {
    const CaseMedia = sequelize.define('CaseMedia', {
        case_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        media_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        case_update_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });

    CaseMedia.associate = function (models) {

    };

    return CaseMedia;
}