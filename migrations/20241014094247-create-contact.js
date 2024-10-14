'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model : "users",
          key : "id"
        },
        onDelete:"CASCADE"
        
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull:true,
        type : Sequelize.DATE

      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contacts');
  }
};