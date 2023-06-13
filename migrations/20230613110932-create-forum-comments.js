'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forum_comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      forum_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Forums',
          key:'id'
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model:'Users',
          key:'id'
        }
      },
      comment: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addIndex('forum_comments', ['user_id']);
    await queryInterface.addIndex('forum_comments', ['forum_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('forum_comments');
  }
};