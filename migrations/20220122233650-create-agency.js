'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('agencies', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            abbr: {
                type: Sequelize.STRING,
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('agencies');
    }
};
