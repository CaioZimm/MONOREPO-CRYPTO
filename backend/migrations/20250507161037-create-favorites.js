'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('favorites', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      cryptoName: {
        type: Sequelize.STRING(255),
        allowNull: false
      }
    });

    await queryInterface.addIndex('favorites', ['userId']);
    await queryInterface.addConstraint('favorites', {
      fields: ['userId', 'cryptoName'],
      type: 'unique',
      name: 'unique_user_crypto_favorite'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('favorites');
  }
};
