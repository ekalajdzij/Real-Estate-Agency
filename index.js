const express = require('express');
const bodyParser = require('body-parser');
const nekretnine = require('./data/nekretnine.json');
const users = require('./data/korisnici.json');
const bcrypt = require('bcrypt');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
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


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    fs.readFile('./data/korisnici.json', 'utf-8', async (error, data) => {
        if (error) {
            console.log(error);
            return;
        }
        if (data) {
            let users = JSON.parse(data);
            var checkVar = false;
            const loop = async () => {
                for (let i = 0; i < users.length; i++) {
                    if (users[i].username === username) {
                        let match = await bcrypt.compare(password, users[i].password);
                        if (match) {
                            checkVar = true;
                            req.session.user = users[i];
                            res.status(200).json({ "poruka": "Uspješna prijava" });
                            return res.end();
                        } else if (!match) {
                            checkVar = true;
                            res.status(401).json({ "greska": "Neuspješna prijava" });
                            return res.end();
                        }
                    }
                    else continue;
                }
            }
            await loop();
            if (!checkVar) {
                res.status(401).json({ "greska": "Neuspješna prijava" });
                return res.end();
            }
        }
    });
});


app.post(('/logout'), (req, res) => {
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
    fs.readFile('./data/nekretnine.json', (error, data) => {
        if (error) {
            res.status(500).json({ greska: error.message });
        } else {
            const listaNekretnina = JSON.parse(data.toString('utf8'));
            res.status(200).json(listaNekretnina);
        }
    });
});

app.get('/korisnik', (req, res) => {
    if (req.session && req.session.user) {
        let user = req.session.user;
        const data = {
            id: user.id,
            ime: user.ime,
            prezime: user.prezime,
            username: user.username,
            password: user.password,
        };
        res.status(200).json(data);
    } else {
        res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
});

app.post('/upit', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
    const user = users.find(user => user.id === req.session.user.id);
    const { nekretnina_id, tekst_upita } = req.body;
    const nekretnina = nekretnine.find(nekretnina => nekretnina.id === parseInt(nekretnina_id, 10));

    if (!nekretnina) {
        return res.status(400).json({ "greska": "Nekretnina sa id-em " + nekretnina_id + " ne postoji" });
    } else {
        const data = {
            korisnik_id: user.id,
            tekst_upita: tekst_upita
        }
        nekretnina.upiti.push(data);
        const jsonData = JSON.stringify(nekretnine);
        fs.writeFile('./data/nekretnine.json', jsonData, 'utf8', (error) => {
            if (error) {
                return res.status(500).json({ "greska": "Došlo je do greške prilikom pisanja u datoteku" });
            } else {
                return res.status(200).json({ "poruka": "Upit je uspješno dodan" });
            }
        });
    }

});

app.put('/korisnik', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
    data = req.body;
    let username = data['username'];
    let password = data['password'];
    let ime = data['ime'];
    let prezime = data['prezime'];
    const userId = req.session.user.id;
    const index = users.findIndex(user => user.id === userId);
    if (index === -1) {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
    if (ime) users[index].ime = ime;
    if (prezime) users[index].prezime = prezime;
    if (username) users[index].username = username;
    if (password) {
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Greška prilikom hasiranja lozinke:', err);
                return;
            }
            users[index].password = hashedPassword;
            fs.writeFile('./data/korisnici.json', JSON.stringify(users), 'utf8', (error) => {
                if (error) {
                    return res.status(500).json({ "greska": "Došlo je do greške prilikom pisanja u datoteku" });
                } else {
                    return res.status(200).json({ "poruka": "Podaci su uspješno ažurirani" });
                }
            });
        });
    } else {
        fs.writeFile('./data/korisnici.json', JSON.stringify(users), 'utf8', (error) => {
            if (error) {
                return res.status(500).json({ "greska": "Došlo je do interne greške prilikom pisanja u datoteku" });
            } else {
                return res.status(200).json({ "poruka": "Podaci su uspješno ažurirani" });
            }
        });
    }
});


app.post('/marketing/nekretnine', (req, res) => {
    try {
        const { nizNekretnina } = req.body;
        fs.readFile('./data/preference.json', (error, data) => {
            if (error) {
                res.status(500).json({ greska: error.message });
            } else {
                let preference = JSON.parse(data);
                nizNekretnina.forEach((idNekretnine) => {
                    const existingIndex = preference.find(item => item.id == idNekretnine);

                    if (existingIndex != null) {
                        existingIndex.pretrage++;
                    } else {
                        preference.push({
                            id: idNekretnine,
                            klikovi: 0,
                            pretrage: 1
                        });
                    }
                    

                });
                fs.writeFile('./data/preference.json', JSON.stringify(preference), 'utf8', (writeError) => {
                    if (writeError) {
                        return res.status(500).json({ "greska": "Došlo je do interne greške prilikom pisanja u datoteku" });
                    } else {
                        return res.status(200).send();
                    }
                });
            }
        });
        
    } catch (error) {
        console.error('Error:', error);
    }
});

app.post('/marketing/nekretnina/:id', (req, res) => {
    try {
        const id = JSON.parse(req.params.id);
        fs.readFile('./data/preference.json', (error, data) => {
            if (error) {
                res.status(500).json({ greska: error.message });
            } else {
                const preference = JSON.parse(data);
                const index = preference.findIndex((item) => item.id == id);

                if (index !== -1) {
                    preference[index].klikovi = (preference[index].klikovi) + 1;
                } else {
                    preference.push({
                        id: id,
                        klikovi: 1,
                        pretrage: 0
                    });
                }
                fs.writeFile('./data/preference.json', JSON.stringify(preference), 'utf8', (writeError) => {
                    if (writeError) {
                        return res.status(500).json({ "greska": "Došlo je do interne greške prilikom pisanja u datoteku" });
                    } else {
                        return res.status(200).send();
                    }
                });
            }

        });
    } catch (error) {
        console.error('Error:', error);
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
            req.session.prviPut	= true;
        } else {
            req.session.osvjezavajJednu = null;
            req.session.prviPut = true;
        }
        
       
        fs.readFile('./data/preference.json', (error, data) => {
            if (error) {
                res.status(500).json({ greska: error.message });
            } else {
                preference = JSON.parse(data);
                changes = findChanges(preferenceStaro, preference);
                preferenceStaro = preference;
                res.status(200).send({ nizNekretnina: changes });
            }
        })
    } else {    //nema body
        fs.readFile('./data/preference.json', (error, data) => {
            if (error) {
                res.status(500).json({ greska: error.message });
            } else {
                preference = JSON.parse(data);
                changes = findChanges(preferenceStaro, preference);
                if (req.session.prviPut != false) {
                    changes = preference;
                    req.session.prviPut = 1;
                } else {
                    changes = findChanges(preferenceStaro, preference);
                }
                if (req.session.osvjezavajJednu != null) {
                    changes = changes.some(item => item.id == req.session.osvjezavajJednu)
                }
                preferenceStaro = preference;
                res.status(200).send({ nizNekretnina: changes });
            }
        })
    }
});

function findChanges(oldArray, newArray) {
    const changes = [];

    newArray.forEach((newObj) => {
        const oldObj = oldArray.find((obj) => obj.id == newObj.id);

        if (oldObj && (oldObj.klikovi != newObj.klikovi || oldObj.pretrage != newObj.pretrage)) {
            changes.push({
                id: newObj.id,
                klikovi: newObj.klikovi,
                pretrage: newObj.pretrage
            })
        }
        if (!oldObj) {
            changes.push({
                id: newObj.id,
                klikovi: newObj.klikovi,
                pretrage: newObj.pretrage
            })
        }
    });

    return changes;
}

app.listen(3000);