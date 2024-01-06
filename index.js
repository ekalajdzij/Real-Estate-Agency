const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const sequelize = require('./public/baza.js');
const express = require('express');
const app = express();
const Nekretnina = require('./public/nekretnine.js')(sequelize);
const Korisnik = require('./public/korisnici.js')(sequelize);
const Upit = require('./public/upiti.js')(sequelize);
const Preferenca = require('./public/preference.js')(sequelize);
Nekretnina.sync();
Korisnik.sync();
Upit.sync();
Preferenca.sync();

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
        const query = 'SELECT * FROM korisniks WHERE username = ?';
        connection.query(query, [username], async (error, result) => {
            if (error) {
                console.error('Error:', err);
                return;
            }
            const user = result[0];
            if (user) {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    req.session.user = user;
                    res.status(200).json({ "poruka": "Uspješna prijava" });
                } else {
                    res.status(401).json({ "greska": "Neuspješna prijava" });
                }
            } else {
                res.status(401).json({ "greska": "Neuspješna prijava" });
            }
        });
    } catch (error) {
        return res.status(401).json({ "greska": "Došlo je do greške prilikom izvršavanja upita" });
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

app.get('/nekretnine', (req, res) => {
    try {
        const query = 'SELECT * FROM nekretninas';
        connection.query(query, (error, results) => {
            if (error) {
                res.status(500).json({ greska: error.message });
            } else {
                res.status(200).json(results);
            }
        });
    } catch (error) {
        res.status(500).json({ greska: error.message });
    }
});

app.get('/korisnik', (req, res) => {
    if (req.session && req.session.user) {
        try {
            const query = 'SELECT * FROM korisniks WHERE username = ?';
            connection.query(query, [req.session.user.username], (error, results) => {
                if (error) {
                    res.status(401).json({ "greska": "Neautorizovan pristup" });
                } else {
                    res.status(200).json(results);
                }
            });
        } catch (error) {
            res.status(401).json({ "greska": "Neautorizovan pristup" });
        }
    } else {
        res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
});

app.post('/upit', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
    const user = req.session.user;
    const { nekretnina_id, tekst_upita } = req.body;
    const queryNekretnina = 'SELECT * FROM nekretninas WHERE id = ?';
    connection.query(queryNekretnina, [nekretnina_id], (errorNekretnina, resultsNekretnina) => {
        if (errorNekretnina) {
            return res.status(500).json({ "greska": "Greška prilikom dohvata nekretnine iz baze podataka" });
        }

        const nekretnina = resultsNekretnina[0];
        if (!nekretnina) {
            return res.status(400).json({ "greska": "Nekretnina sa id-em " + nekretnina_id + " ne postoji" });
        }

        const queryUpit = 'INSERT INTO upits (tekst_upita, nekretnina_id, korisnik_id) VALUES (?, ?, ?)';
        connection.query(queryUpit, [tekst_upita, nekretnina_id, user.id], (errorUpit, resultsUpit) => {
            if (errorUpit) {
                return res.status(500).json({ "greska": "Greška prilikom dodavanja upita u bazu podataka" });
            } else {
                return res.status(200).json({ "poruka": "Upit je uspješno dodan" });
            }
        });
    });
});

app.put('/korisnik', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
    const { username, password, ime, prezime } = req.body;
    const userId = req.session.user.id;

    const query = 'SELECT * FROM korisniks WHERE id = ?';
    connection.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ "greska": "Greška prilikom dohvata korisnika iz baze podataka" });
        }

        if (results.length === 0) {
            return res.status(401).json({ "greska": "Neautorizovan pristup" });
        }

        const user = results[0];

        let updateQuery = 'UPDATE korisniks SET ';
        let params = [];

        if (ime) {
            updateQuery += 'ime = ?, ';
            params.push(ime);
        }
        if (prezime) {
            updateQuery += 'prezime = ?, ';
            params.push(prezime);
        }
        if (username) {
            updateQuery += 'username = ?, ';
            params.push(username);
        }
        if (password) {
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Greška prilikom hasiranja lozinke:', err);
                    return res.status(500).json({ "greska": "Došlo je do greške prilikom spašavanja." });
                }
                updateQuery += 'password = ?, ';
                params.push(hashedPassword);
                updateQuery = updateQuery.slice(0, -2);
                updateQuery += ' WHERE id = ?';
                params.push(userId);

                connection.query(updateQuery, params, (errorUpdate, resultsUpdate) => {
                    if (errorUpdate) {
                        return res.status(500).json({ "greska": "Došlo je do greške prilikom ažuriranja." });
                    } else {
                        return res.status(200).json({ "poruka": "Podaci su uspješno ažurirani" });
                    }
                });
            });
        } else {
            updateQuery = updateQuery.slice(0, -2);
            updateQuery += ' WHERE id = ?';
            params.push(userId);

            connection.query(updateQuery, params, (errorUpdate, resultsUpdate) => {
                if (errorUpdate) {
                    return res.status(500).json({ "greska": "Došlo je do greške prilikom ažuriranja." });
                } else {
                    return res.status(200).json({ "poruka": "Podaci su uspješno ažurirani" });
                }
            });
        }
    });
});


app.get('/upiti/:nekretninaId', (req, res) => {
    const nekretninaId = req.params.nekretninaId;
    const query = `
        SELECT upits.*, korisniks.username
        FROM upits
        INNER JOIN korisniks ON upits.korisnik_id = korisniks.id
        WHERE upits.nekretnina_id = ?;
    `;
    connection.query(query, [nekretninaId], (error, results) => {
        if (error) {
            console.error('Greška prilikom dohvata upita:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json(results);
        }
    });
});


app.get('/nekretnina/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM nekretninas WHERE id = ?';
    connection.query(query, [id], (error, results) => {
        if (results.length == 0) return res.status(400).json({ greska: `Nekretnina sa ID-em ${id} ne postoji` });
        const detalji = results[0];
        res.status(200).json(detalji);
    });
});

app.post('/marketing/nekretnine', (req, res) => {
    try  {
        const { nizNekretnina } = req.body;
        connection.query('SELECT * FROM preferencas', (error, results) => {
            if (error) {
                return res.status(500).json({ "greska": error.message });
            }
            let preference = results;

            nizNekretnina.forEach((idNekretnine) => {
                const existingIndex = preference.find(item => item.id == idNekretnine);
                if (existingIndex != null) {
                    existingIndex.pretrage++;
                    connection.query('UPDATE preferencas SET pretrage = ? WHERE nekretnina_id = ?', [existingIndex.pretrage, idNekretnine], (updateError, updateResults) => {
                        if (updateError) {
                            return res.status(500).json({ "greska": updateError.message });
                        }
                    });
                } else {
                    let nekretninaExists = false;
                    connection.query('SELECT * FROM nekretninas WHERE id = ?', idNekretnine, (error, results) => {
                        if (results.length > 0) nekretninaExists = true;
                        let id = 0;
                        if (nekretninaExists) {
                            connection.query('SELECT MAX(id) AS maxId FROM preferencas', (maxIdError, maxIdResult) => {
                                id = maxIdResult[0].maxId + 1;
                                const query = 'INSERT INTO preferencas (id, nekretnina_id, pretrage, klikovi) VALUES (?, ?, 1, 0)'
                                connection.query(query, [id, idNekretnine], (insertError, results) => {
                                    if (insertError) {
                                        return res.status(500).json({ "greska": insertError.message });
                                    }
                                });
                            });
                        }
                    });
                }
            });
            return res.status(200).send();
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ "greska": "Došlo je do interne greške" });
    }
});

app.post('/marketing/nekretnina/:id', (req, res) => {
    try {
        const idNekretnine = JSON.parse(req.params.id);
        connection.query('SELECT * FROM nekretninas WHERE id = ?', idNekretnine, (selectError, selectResults) => {
            if (selectError) {
                return res.status(500).json({ "greska": selectError.message });
            }
            if (selectResults.length === 0) {
                return res.status(404).json({ "greska": "Nekretnina sa datim ID-om ne postoji." });
            }
            connection.query('SELECT * FROM preferencas WHERE nekretnina_id = ?', idNekretnine, (error, results) => {
                if (error) {
                    return res.status(500).json({ "greska": error.message });
                }

                const preference = results.length > 0 ? results[0] : null;

                if (preference) {
                    connection.query('UPDATE preferencas SET klikovi = klikovi + 1 WHERE nekretnina_id = ?', idNekretnine, (updateError) => {
                        if (updateError) {
                            return res.status(500).json({ "greska": updateError.message });
                        }
                        return res.status(200).send();
                    });
                } else {
                    connection.query('SELECT MAX(id) AS maxId FROM preferencas', (maxIdError, maxIdResult) => {
                        const nextId = maxIdResult[0].maxId + 1;
                        const query = 'INSERT INTO preferencas (id, nekretnina_id, klikovi, pretrage) VALUES (?, ?, 1, 0)';
                        connection.query(query, [nextId, idNekretnine], (insertError) => {
                            if (insertError) {
                                return res.status(500).json({ "greska": insertError.message });
                            }
                            return res.status(200).send();
                        });
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ "greska": "Došlo je do interne greške" });
    }
});

let preferenceStaro = [{}];
let preference = [];
let changes = [];
app.post('/marketing/osvjezi', (req, res) => {
    if (Object.keys(req.body).length !== 0) { // ima body
        const nizNekretnina = req.body.nizNekretnina;
        if (nizNekretnina.length == 1) {
            req.session.osvjezavajJednu = nizNekretnina[0];
            req.session.prviPut = true;
        } else {
            req.session.osvjezavajJednu = null;
            req.session.prviPut = true;
        }

        connection.query('SELECT * FROM preferencas', (error, results) => {
            if (error) {
                return res.status(500).json({ "greska": error.message });
            }
            preference = results;
            changes = findChanges(preferenceStaro, preference);
            preferenceStaro = preference;
            res.status(200).send({ nizNekretnina: changes });
        });
    } else { // nema body
        connection.query('SELECT * FROM preferencas', (error, results) => {
            if (error) {
                return res.status(500).json({ "greska": error.message });
            }
            preference = results;
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
        });
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