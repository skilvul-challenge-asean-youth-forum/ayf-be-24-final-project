'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey : 'id' })
      User.hasMany(models.forum_comments, { foreignKey : 'user_id' })
      User.hasMany(models.news_comments, { foreignKey : 'user_id' })
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.TEXT,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};