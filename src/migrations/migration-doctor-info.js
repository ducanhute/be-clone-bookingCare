"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Doctor_Info", {
            // Trường id tự tăng
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            doctorId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            specialtyId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            clinicId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            priceId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            provinceId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            paymentId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            clinicAddress: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            clinicAddressEn: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            clinicName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            clinicNameEn: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            note: {
                type: Sequelize.STRING,
            },
            noteEn: {
                type: Sequelize.STRING,
            },
            count: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 0,
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
        await queryInterface.dropTable("Doctor_Info");
    },
};
