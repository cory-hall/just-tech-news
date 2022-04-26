const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {}

// define table columns and configuration
User.init(
   {
      // define an id column
      id: {
         // use the special sequelize DataTypes object to provide what type of data it is
         type: DataTypes.INTEGER,
         // this is the equivalent of SQL's NOT NULL option
         allowNull: false,
         // instructions that this is the Primary Key
         primaryKey: true,
         // turn on auto increment
         autoIncrement: true
      },
      // define a username column
      username: {
         type: DataTypes.STRING,
         allowNull: false
      },
      email: {
         type: DataTypes.STRING,
         allowNull: false,
         // there cannot be any duplicate values in this table
         unique: true,
         // if allowNull is set to false, we can run our own data through validators before creating the table data
         validate: {
            isEmail: true
         }
      },
      password: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            // this means the password must be at least 4 characters long
            len: [4]
         }
      }
   },
   {
      hooks: {
         // set up beforeCreate lifecycle "hook" functionality
         async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
         },
         // set up beforeUpdate lifecycle "hook" functionality
         async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
         }
      },
      // TABLE CONFIGURATION OPTIONS GO HERE

      // pass in our imported sequelize connection (the direct connection to our database)
      sequelize,
      // dont automatically create createdAt/updatedAt timestamp fields
      timestamps: false,
      // dont pluralize name of database table
      freezeTableName: true,
      // use underscores instead of camel-casing
      underscored: true,
      // make it so our model name start lowercase in the database
      modelName: 'user'
   }
);

module.exports = User;
