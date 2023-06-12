'use strict';
const User = require('./user'); 

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile_details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile_details.belongsTo(models.User);
    }
  }
  Profile_details.init({
    no_hp: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile_details',
  });
  return Profile_details;
};