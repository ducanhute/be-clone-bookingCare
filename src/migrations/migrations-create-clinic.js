"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Clinic", {
            // Trường id tự tăng
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            nameEn: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            addressEn: {
                type: Sequelize.STRING,
            },
            descriptionMarkdown: {
                type: Sequelize.TEXT,
            },
            descriptionMarkdownEn: {
                type: Sequelize.TEXT,
            },
            descriptionHTML: {
                type: Sequelize.TEXT,
            },
            descriptionHTMLEn: {
                type: Sequelize.TEXT,
            },
            image: {
                type: Sequelize.BLOB("long"),
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Clinic");
    },
};
