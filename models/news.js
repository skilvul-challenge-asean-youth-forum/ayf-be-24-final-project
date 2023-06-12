'use strict';
const Comment = require('./comment'); 

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      News.hasMany(models.Comment);
    }
  }
  News.init({
    title: DataTypes.STRING,
    category: DataTypes.STRING,
    content: DataTypes.STRING,
    id_comment: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'News',
  });
  return News;
};