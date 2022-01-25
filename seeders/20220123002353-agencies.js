'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Agencies', [
            {
                name: 'Nigerian Police Force',
                abbr: 'NPF'
            },
            {
                name: 'National Drug Law Enforcement Agency',
                abbr: 'NDLEA'
            },
            {
                name: 'Nigeria Customs Service',
                abbr: 'NCS'
            },
            {
                name: 'Economic and Financial Crimes Commission',
                abbr: 'EFCC'
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
