'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class news_comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      news_comments.belongsTo(models.User, {foreignKey:'id'})
      news_comments.belongsTo(models.News, {foreignKey:'id'})
    }
  }
  news_comments.init({
    news_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'news_comments',
  });
  return news_comments;
};