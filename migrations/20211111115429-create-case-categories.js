'use strict';

const utilities = require("../libraries/utilities")

const categories = utilities.caseCategories

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
        return queryInterface.createTable('case_categories', {
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
          queryInterface.bulkInsert("case_categories", catArr);
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('case_categories');
    }
};
