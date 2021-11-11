'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        return queryInterface.createTable('case_media', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            case_id: {
              type: Sequelize.UUID,
              allowNull: false
            },
            media_url: {
              type: Sequelize.STRING,
              allowNull: false
            },
            case_update_id: { //if pohoto is tied to a particular update on the case
              type: Sequelize.INTEGER,
              allowNull: true
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('case_media');
    }
};
