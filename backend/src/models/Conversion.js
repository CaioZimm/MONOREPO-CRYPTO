const database = require('../../config/database');
const { DataTypes } = require('sequelize');

const Conversion = database.define('Conversion', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cryptoName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(36, 18),
        allowNull: false
    },
    brl: {
        type: DataTypes.DECIMAL(36, 18),
        allowNull: false
    },
    usd: {
        type: DataTypes.DECIMAL(36, 18),
        allowNull: false
    }
}, {
    tableName: 'conversions',
    timestamps: true,
});

module.exports = Conversion;