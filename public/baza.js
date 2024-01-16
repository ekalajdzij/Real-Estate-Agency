const Sequelize = require('sequelize');
const sequelize = new Sequelize('wt24', "root", "password", {
    host: 'localhost',
    dialect: 'mysql',
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Nekretnina = require('./nekretnine.js')(sequelize);
db.Korisnik = require('./korisnici.js')(sequelize);
db.Upit = require('./upiti.js')(sequelize);
db.Preferenca = require('./preference.js')(sequelize);

db.Nekretnina.hasMany(db.Upit, { foreignKey: 'nekretnina_id' });
db.Korisnik.hasMany(db.Upit, { foreignKey: 'korisnik_id' }); 
db.Nekretnina.hasMany(db.Preferenca, { foreignKey: 'nekretnina_id' });
db.Upit.belongsTo(db.Nekretnina, { foreignKey: 'nekretnina_id'});
db.Upit.belongsTo(db.Korisnik, { foreignKey: 'korisnik_id'});
db.Preferenca.belongsTo(db.Nekretnina, { foreignKey: 'nekretnina_id'});

module.exports = db;