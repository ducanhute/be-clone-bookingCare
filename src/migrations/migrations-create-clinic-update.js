module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn("clinics", "nameEn", {
                type: Sequelize.STRING,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {},
};
