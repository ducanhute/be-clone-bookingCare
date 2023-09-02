module.exports = {
    up: function (queryInterface, Sequelize) {
        return [queryInterface.addColumn("specialty", "nameEn", Sequelize.STRING), queryInterface.addColumn("specialty", "descriptionHTMLEN", Sequelize.TEXT)];
    },

    down: function (queryInterface, Sequelize) {
        // logic for reverting the changes
    },
};
