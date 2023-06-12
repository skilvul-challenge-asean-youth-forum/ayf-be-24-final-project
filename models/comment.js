'use strict';
const User = require('./user'); 
const Forum = require('./forum'); 
const News = require('./news'); 

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.User);
      Comment.belongsTo(models.Forum);
      Comment.belongsTo(models.News);
    }
  }
  Comment.init({
    content: DataTypes.STRING,
    position: DataTypes.STRING,
    id_user: DataTypes.INTEGER,
    id_forum: DataTypes.INTEGER,
    id_news: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};