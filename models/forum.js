'use strict';
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
      Forum.hasMany(models.Forum, {foreignKey:'id'})
    }
  }
  Forum.init({
    author: DataTypes.STRING,
    title: DataTypes.STRING,
    descrition: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Forum',
  });
  return Forum;
};