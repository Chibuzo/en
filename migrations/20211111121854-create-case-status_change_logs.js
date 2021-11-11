'use strict';


module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        return queryInterface.createTable('case_status_change_logs', {
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
            status_id: {
              type: Sequelize.INTEGER,
              allowNull: false
            },
            changed_by: {
              type: Sequelize.INTEGER,
              allowNull: false
            },
            createdAt: {
              allowNull: false,
              type: Sequelize.DATE
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('case_status_change_logs');
    }
};
