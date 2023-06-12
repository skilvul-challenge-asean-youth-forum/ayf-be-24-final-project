'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      content: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0,
        references: {
          model: 'Users',
          key: 'id'
        }    
      },
      id_forum: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0,
        references: {
          model: 'Forums',
          key: 'id'
        }
      },
      id_news: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0,
        references: {
          model: 'News',
          key: 'id'
        }
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
    await queryInterface.addIndex('Comments', ['id_forum']);
    await queryInterface.addIndex('Comments', ['id_news']);
    await queryInterface.addIndex('Comments', ['id_user']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};