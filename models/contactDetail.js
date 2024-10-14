'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contactDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      contactDetails.belongsTo(models.contacts, {
        foreignKey: 'contact_id',
        as: 'contact',
        onDelete: 'CASCADE',
        hooks: true
      });
      
    }
  }
  contactDetails.init({
    type: DataTypes.STRING,
    value: DataTypes.STRING,
    contactId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'contactDetails',
    underscored: true,
    paranoid:true
  });
  return contactDetails;
};