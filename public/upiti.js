const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Upit = sequelize.define('Upit', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tekst_upita: Sequelize.STRING,
        nekretnina_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'nekretninas',
                key: 'id'
            }
        },
        korisnik_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'korisniks',
                key: 'id'
            }
        }
    });

    return Upit;
}
