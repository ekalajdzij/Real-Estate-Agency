const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt24', "root", "password", {
    host: 'localhost',
    dialect: 'mysql',
});
const Nekretnina = require('./nekretnine.js')(sequelize);
const Upit = require('./upiti.js')(sequelize);
const Korisnik = require('./korisnici.js')(sequelize);
const Preferenca = require('./preference.js')(sequelize);
Nekretnina.hasMany(Upit, { foreignKey: 'nekretnina_id' });
Korisnik.hasMany(Upit, { foreignKey: 'korisnik_id' }); 
Nekretnina.hasMany(Preferenca, { foreignKey: 'nekretnina_id' });
Upit.belongsTo(Korisnik, { foreignKey: 'korisnik_id'});
Upit.belongsTo(Nekretnina, { foreignKey: 'nekretnina_id'});
Preferenca.belongsTo(Nekretnina, { foreignKey: 'nekretnina_id'});

module.exports = sequelize;