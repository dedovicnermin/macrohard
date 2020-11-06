const Sequelize = require("sequelize");

module.exports = new Sequelize('macrohard', '', '', {
    host: 'localhost',
    dialect: 'postgres',
    operatorAliases: false,
    port: 5432,

    pool: {
        max: 10,
        min: 0,
        aquire: 30000,
        idle: 10000
    }
});