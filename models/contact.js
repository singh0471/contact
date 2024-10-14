'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contacts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      contacts.belongsTo(models.users, {
        foreignKey:"user_id",
        as:"user",
        onDelete:"CASCADE",
        hooks:true
      })

      contacts.hasMany(models.contactDetails, {
        foreignKey: "contact_id",
        as: "contactDetails",
        onDelete: "CASCADE",
        hooks: true
      });
    }
  }
  contacts.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'contacts',
    underscored: true,
    paranoid: true
  });
  return contacts;
};