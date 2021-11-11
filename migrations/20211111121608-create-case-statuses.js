'use strict';

const utilities = require("../libraries/utilities")

const statuses = utilities.caseStatuses
const catArr = []; 
statuses.forEach((item, index) => {
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
        return queryInterface.createTable('case_statuses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            } 
        }).then(() => {
          queryInterface.bulkInsert("case_statuses", catArr);
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('case_statuses');
    }
};
