'use strict';
const Comment = require('./comment'); 

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Forum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Forum.hasMany(models.Comment);
    }
  }
  Forum.init({
    author: DataTypes.STRING,
    name: DataTypes.STRING,
    descrition: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Forum',
  });
  return Forum;
};