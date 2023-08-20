'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'admin@example.com',
      password: '1234',
      firstName: 'Ha',
      lastName: 'Duc Anh',
      address: 'Viet Nam',
      gender: 1,
      phonenumber: "03232345",
      positionId: '1632',
      image: 'avatar',
      roleId: '021',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
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
