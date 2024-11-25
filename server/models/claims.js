const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Adjust the path as necessary
const User = require('./user'); // Adjust the path as necessary

const Claim = sequelize.define('Claim', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  claimType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  claimAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
  },
}, {
  timestamps: true,
});

User.hasMany(Claim, { foreignKey: 'userId' });
Claim.belongsTo(User, { foreignKey: 'userId' });

module.exports = Claim;