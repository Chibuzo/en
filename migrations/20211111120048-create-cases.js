'use strict';

const categories = [
  "police brutality",
  "domestic violence"
];

const catArr = []; 
categories.forEach((item, index) => {
  let cat = {name: item}
  catArr.push(cat)
})

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
                type: Sequelize.UUID,
                primaryKey: true,
                defaultValue: Sequelize.UUIDV4
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
              allowNull: true
            },
            culprit: {
              type: Sequelize.TEXT,
              allowNull: true
            },
            category_id: {
              type: Sequelize.INTEGER,
              allowNull: false
            }, 
            added_by: {
              type: Sequelize.INTEGER,
              allowNull: false
            }, 
            status_id: {
              type: Sequelize.INTEGER,
              allowNull: false
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
