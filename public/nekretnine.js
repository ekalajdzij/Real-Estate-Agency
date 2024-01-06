const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    const Nekretnina = sequelize.define('Nekretnina', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tip_nekretnine: Sequelize.STRING,
        naziv: Sequelize.STRING,
        kvadratura: Sequelize.INTEGER,
        cijena: Sequelize.INTEGER,
        tip_grijanja: Sequelize.STRING,
        lokacija: Sequelize.STRING,
        godina_izgradnje: Sequelize.INTEGER,
        datum_objave: Sequelize.STRING,
        opis: Sequelize.STRING

    });
    return Nekretnina;
}