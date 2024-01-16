const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const sequelize = require('./public/baza.js');

sequelize.sequelize.sync({ force: true })
    .then(() => {
        require('./public/priprema.js');
    })
    .catch((error) => {
        console.error('Greška prilikom sync operacije:', error);
    });
//require('./public/priprema.js');
const express = require('express');
const app = express();
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'wt24'
});
connection.connect();
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public/html')));
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'spirala3',
    resave: true,
    saveUninitialized: true
}));


app.get('/css/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, 'public', 'css', file), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

app.get('/scripts/nekretnine.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'public', 'scripts', 'nekretnine.js'));
});

app.get('/scripts/SpisakNekretnina.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'public', 'scripts', 'SpisakNekretnina.js'));
});

app.get('/PoziviAjax.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'public', 'PoziviAjax.js'));
});

app.get('/MarketingAjax.js', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'public', 'MarketingAjax.js'));
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    try {
        const users = await sequelize.Korisnik.findAll({where: {username: username}});
        if (users.length > 0) {
          const user = users[0];
          const match = await bcrypt.compare(password, user.password);
          if (match) {
                req.session.user = user;
                res.status(200).json({ "poruka": 'Uspješna prijava' });
          } else {
                res.status(401).json({ "greska": 'Neuspješna prijava' });
          }
        } else {
                res.status(401).json({ "greska": 'Neuspješna prijava' });
        }
      } catch (error) {
            return res.status(401).json({ "greska": 'Došlo je do greške prilikom izvršavanja upita' });
    }
});
app.post('/logout', (req, res) => {
    if (req.session && req.session.user) {
        req.session.destroy((error) => {
            if (error) {
                res.status(401).json({ "greska": "Neautorizovan pristup" });
            } else {
                res.status(200).json({ "poruka": "Uspješna odjava" });
            }
        });
    } else {
        res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
});

app.get('/nekretnine', async (req, res) => {
    try {
        const nekretnine = await sequelize.Nekretnina.findAll();
        res.status(200).json(nekretnine);
    } catch (error) {
        res.status(500).json({ "greska": error.message });
    }
});

app.get('/korisnik', async (req, res) => {
    if (req.session && req.session.user) {
        try {
          const user = await sequelize.Korisnik.findOne({where: {username: req.session.user.username}});
          if (user) {
            res.status(200).json(user);
          } else {
            res.status(401).json({ "greska": 'Neautorizovan pristup' });
          }
        } catch (error) {
          res.status(401).json({ "greska": 'Neautorizovan pristup' });
        }
      } else {
        res.status(401).json({ "greska": 'Neautorizovan pristup' });
      }
});

app.post('/upit', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ greska: 'Neautorizovan pristup' });
      }
      const user = req.session.user;
      const { nekretnina_id, tekst_upita } = req.body;

      try {
        const nekretnina = await sequelize.Nekretnina.findOne({where: {id: nekretnina_id,}});
        if (!nekretnina) {
          return res.status(400).json({ "greska": 'Nekretnina sa id-em ' + nekretnina_id + ' ne postoji' });
        }
        await sequelize.Upit.create({
          tekst_upita: tekst_upita,
          nekretnina_id: nekretnina_id,
          korisnik_id: user.id,
        });
        return res.status(200).json({ "poruka": 'Upit je uspješno dodan' });

        } catch (error) {
            return res.status(500).json({ "greska": 'Greška prilikom dodavanja upita u bazu podataka' });
        }
});

app.put('/korisnik', async (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ "greska": 'Neautorizovan pristup' });
      }
    
      const { username, password, ime, prezime } = req.body;
      const userId = req.session.user.id;
    
      try {
        const user = await sequelize.Korisnik.findByPk(userId);
        if (!user) {
          return res.status(401).json({ "greska": 'Neautorizovan pristup' });
        }
        if (ime) {
          user.ime = ime;
        }
        if (prezime) {
          user.prezime = prezime;
        }
        if (username) {
          user.username = username;
        }
        if (password) {
          const hashedPassword = await bcrypt.hash(password, 10);
          user.password = hashedPassword;
            await user.save();
        } else {
            await user.save();
        }
        return res.status(200).json({ "poruka": 'Podaci su uspješno ažurirani' });
      } catch (error) {
        return res.status(500).json({ "greska": 'Došlo je do greške prilikom ažuriranja.' });
      }
    });

app.get('/upiti/:nekretninaId', async (req, res) => {
    const nekretninaId = req.params.nekretninaId;
    try {
        const upiti = await sequelize.Upit.findAll({where: {nekretnina_id: nekretninaId}, include: {model: sequelize.Korisnik, attributes: ['username']}});
        res.status(200).json(upiti);
    } catch (error) {
        res.status(500).json({ "greska": 'Internal Server Error' });
    }
});

app.get('/nekretnina/:id', async (req, res) => {
    const id = req.params.id
        const nekretnina = await sequelize.Nekretnina.findByPk(id);
        if (!nekretnina) {
          return res.status(400).json({ "greska": `Nekretnina sa ID-em ${id} ne postoji` });
        }
        res.status(200).json(nekretnina);
});

app.post('/marketing/nekretnine', async (req, res) => {
    try {
        const { nizNekretnina } = req.body;
        const preference = await sequelize.Preferenca.findAll();
    
        for (const idNekretnine of nizNekretnina) {
            const existingIndex = preference.find(item => item.nekretnina_id === idNekretnine);
    
          if (existingIndex) {
            existingIndex.pretrage++;
            await existingIndex.save();
          } else {
                const nekretninaExists = await sequelize.Nekretnina.findByPk(idNekretnine);
            if (nekretninaExists) {
                const maxIdResult = await sequelize.Preferenca.max('id');
                const id = maxIdResult + 1;

              await sequelize.Preferenca.create({
                id: id,
                nekretnina_id: idNekretnine,
                pretrage: 1,
                klikovi: 0,
              });
            }
          }
        }
        return res.status(200).send();
      } catch (error) {
        return res.status(500).json({ "greska": "Došlo je do interne greške" });
      }
});

app.post('/marketing/nekretnina/:id', async (req, res) => {
    try {
        const idNekretnine = JSON.parse(req.params.id);
        const nekretnina = await sequelize.Nekretnina.findByPk(idNekretnine);
    
        if (!nekretnina) {
          return res.status(404).json({ "greska": "Nekretnina sa datim ID-ijem ne postoji." });
        }
        let preference = await sequelize.Preferenca.findOne({ where: { nekretnina_id: idNekretnine } });
        if (preference) {
            preference.klikovi++;
            await preference.save();
        } else {
          const maxIdResult = await sequelize.Preferenca.max('id');
          const id = maxIdResult + 1;
          preference = await sequelize.Preferenca.create({
            id: id,
            nekretnina_id: idNekretnine,
            klikovi: 1,
            pretrage: 0,
          });
        }

        return res.status(200).send();
      } catch (error) {
        return res.status(500).json({ "greska": "Došlo je do interne greške" });
      }
});

let preferenceStaro = [{}];
let preference = [];
let changes = [];
app.post('/marketing/osvjezi', async (req, res) => {
    if (Object.keys(req.body).length !== 0) { // ima body
        const nizNekretnina = req.body.nizNekretnina;
        if (nizNekretnina.length == 1) {
            req.session.osvjezavajJednu = nizNekretnina[0];
            req.session.prviPut = true;
        } else {
            req.session.osvjezavajJednu = null;
            req.session.prviPut = true;
        }
        const preference = await sequelize.Preferenca.findAll();
        changes = findChanges(preferenceStaro, preference);
        preferenceStaro = preference;
        res.status(200).send({ nizNekretnina: changes });
    } else { // nema body
        preference = await sequelize.Preferenca.findAll();
        changes = findChanges(preferenceStaro, preference);
        if (req.session.prviPut != false) {
            changes = preference;
            req.session.prviPut = 1;
        } else {
            changes = findChanges(preferenceStaro, preference);
        }
        if (req.session.osvjezavajJednu != null) {
            changes = changes.some(item => item.id == req.session.osvjezavajJednu);
        }
        preferenceStaro = preference;
        return res.status(200).send({ nizNekretnina: changes });   
    }
});

function findChanges(oldArray, newArray) {
    const changes = [];

    newArray.forEach((newObj) => {
        const oldObj = oldArray.find((obj) => obj.nekretnina_id == newObj.nekretnina_id);

        if (oldObj && (oldObj.klikovi != newObj.klikovi || oldObj.pretrage != newObj.pretrage)) {
            changes.push({
                id: newObj.nekretnina_id,
                klikovi: newObj.klikovi,
                pretrage: newObj.pretrage
            });
        }
        if (!oldObj) {
            changes.push({
                id: newObj.nekretnina_id,
                klikovi: newObj.klikovi,
                pretrage: newObj.pretrage
            });
        }
    });

    return changes;
}
app.listen(3000);