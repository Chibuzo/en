'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('caseCategories', [
      {
        name: 'Brutality'
      },
      {
        name: 'Extortion'
      },
      {
        name: 'Extrajudicial Killing'
      },
      {
        name: 'Harrassment'
      },
      {
        name: 'Undue arrest'
      },
      {
        name: 'Rogue operation'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
