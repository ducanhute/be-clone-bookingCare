"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("markdowns", {
            // Trường id tự tăng
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            contentHTML: {
                allowNull: false,
                type: Sequelize.TEXT("long"),
            },
            contentHTMLEn: {
                allowNull: false,
                type: Sequelize.TEXT("long"),
            },
            contentMarkdown: {
                allowNull: false,
                type: Sequelize.TEXT("long"),
            },
            contentMarkdownEn: {
                allowNull: false,
                type: Sequelize.TEXT("long"),
            },
            description: {
                allowNull: true,
                type: Sequelize.TEXT("long"),
            },
            descriptionEn: {
                allowNull: true,
                type: Sequelize.TEXT("long"),
            },
            doctorId: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            specialtyId: {
                allowNull: true,
                type: Sequelize.INTEGER,
            },
            clinicId: {
                allowNull: true,
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("markdowns");
    },
};
