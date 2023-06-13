'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class forum_comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      forum_comments.belongsTo(Forum, {foreignKey:'forum_id'})
      forum_comments.belongsTo(User, {foreignKey:'user_id'})
    }
  }
  forum_comments.init({
    forum_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'forum_comments',
  });
  return forum_comments;
};