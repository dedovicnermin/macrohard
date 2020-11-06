const Sequelize = require("sequelize");

<<<<<<< HEAD
module.exports = new Sequelize('macrohard', 'nerm', 'worm', {
=======
module.exports = new Sequelize('macrohard', '', '', {
>>>>>>> master
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