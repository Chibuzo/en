'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('cases', {
      id: {
        allowNull: false,
        //type: Sequelize.UUID,
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        // defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      victim: {
        type: Sequelize.STRING,
      },
      culprit: {
        type: Sequelize.STRING,
      },
      location: Sequelize.STRING,
      event_date: Sequelize.DATE,
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }

    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('cases');
  }
};
