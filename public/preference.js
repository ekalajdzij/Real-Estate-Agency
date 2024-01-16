const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    const Preferenca = sequelize.define('Preferenca', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nekretnina_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'nekretninas',
                key: 'id'
            }
        },
        pretrage: Sequelize.INTEGER,
        klikovi: Sequelize.INTEGER
    });
    return Preferenca;
}