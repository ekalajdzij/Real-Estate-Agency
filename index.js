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
    res.sendFile(path.join(__dirname, 'public','css', file), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

const readJSONFile = (filename) => {
    const data = fs.readFileSync(filename, "utf8");
    return JSON.parse(data);
}

const writeJsonFile = (filename, data) => {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
}

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
    const {username, password} = req.body;
    fs.readFile('./data/korisnici.json', 'utf-8', async(error, data) => {
        if (error) {
            console.log(error);
            return;
        }
        if (data) {
            let users = JSON.parse(data);
            var checkVar = false;
            const loop = async() => {
                for (let i = 0; i<users.length; i++) {
                    if (users[i].username === username) {
                        let match = await bcrypt.compare(password, users[i].password);
                        if (match) {
                            checkVar = true;
                            req.session.user = users[i];
                            res.status(200).json({poruka: "Uspješna prijava"});
                            return res.end();
                        } else if (!match) {
                            checkVar = true;
                            res.status(401).json({greska: "Neuspješna prijava"});
                            return res.end();
                        }
                    }
                    else continue;
                }
            }
            await loop();
            if(!checkVar) {
                res.status(401).json({greska: "Neuspješna prijava"});
                return res.end();
            }
        }
    });
});
/*
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (user) {
        if (password === user.password) {
            req.session.user = user;
            //console.log(req.session.user);
            res.status(200).json({ "poruka": "Uspješna prijava" });
        } else {
            res.status(401).json({ "greska": "Neuspješna prijava" });
        }
    } else {
        res.status(401).json({ "greska": "Neuspješna prijava" });
    }
});/*
        if (password === user.password) {
            req.session.user = user;
            //console.log(req.session.user);
            res.status(200).json({ "poruka": "Uspješna prijava" });
        } else {
            res.status(401).json({ "greska": "Neuspješna prijava" });
        }
    } else {
        res.status(401).json({ "greska": "Neuspješna prijava" });
    }
});*/

app.post(('/logout'), (req, res) => {
    if (req.session && req.session.user) {
        req.session.destroy((error) => {
            //console.log("odjava pokusaj");
            if (error) {
                res.status(401).json({ "greska": "Neautorizovan pristup" });
            } else {
                //console.log("odjava uspjela");
                res.status(200).json({ "poruka": "Uspješna odjava" });
            }
        });
    } else {
        res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
});
app.get('/nekretnine', (req, res) => {
    const listaNekretnina = readJSONFile('./data/nekretnine.json');
    res.status(200).json(listaNekretnina);
});

app.get('/provjeriPrijavu', (req, res) => {
    if (req.session && req.session.user) {
        res.status(200).json({ prijavljen: true, user: req.session.user });
    } else {
        //console.log(req.session.user);
        res.status(200).json({ prijavljen: false });
    }
});

app.get('/korisnik', (req, res) => {
    //console.log(req.session);
    //console.log(req.session.user);
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
        return  res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
    const user = users.find(user => user.id === req.session.user.id);
    //console.log(req.body);
    const {nekretnina_id, tekst_upita} = req.body;
    const nekretnina = nekretnine.find(nekretnina => nekretnina.id === parseInt(nekretnina_id, 10));
    //console.log(req.body);
    //console.log(nekretnina_id);
    //console.log(tekst_upita);
    //console.log(nekretnina);
    if (!nekretnina) {
        return res.status(400).json({"greska":"Nekretnina sa id-em " + nekretnina_id + " ne postoji"});
    } else {
        const data = {
            korisnik_id: user.id,
            tekst_upita: tekst_upita
        }
        nekretnina.upiti.push(data);
        //console.log(nekretnina);
        writeJsonFile('./data/nekretnine.json', nekretnine);
        return res.status(200).json({"poruka":"Upit je uspješno dodan"});
    }

});

app.put('/korisnik', (req, res) => {
    if (!req.session || !req.session.user) {
        return res.status(401).json({ "greska": "Neautorizovan pristup" });
    }
    console.log(req.session.user);
    data = req.body;
    console.log(req.body);
    //let data = JSON.parse(req.body);
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
            writeJsonFile('./data/korisnici.json', users);
        });
    }
    return res.status(200).json({ "poruka": "Podaci su uspješno ažurirani" });
});


app.post('/marketing/nekretnine', (req, res) => {
    const { nizNekretnina } = req.body;
    const preference = readJSONFile('./data/preference.json');
    nizNekretnina.forEach((idNekretnine) => {
        preference.pretrage[idNekretnine] = (preference.pretrage[idNekretnine] || 0) + 1;
    });
    writeJsonFile('./data/preference.json', preference);
    res.status(200).send();
});

app.post('/marketing/nekretnina/:id', (req, res) => {
    const { id } = req.params;
    const preference = readJSONFile('./data/preference.json');
    preference.klikovi[id] = (preference.klikovi[id] || 0) + 1;
    writeJsonFile('./data/preference.json', preference)
    res.status(200).send();
});

app.post('/marketing/osvjezi', (req, res) => {
    const { nizNekretnina } = req.body;
    const preference = readJSONFile('./data/preference.json');

    const promjene = nizNekretnina.filter(id => {
        return (
            preference.pretrage[id] !== undefined ||
            preference.klikovi[id] !== undefined
        );
    });

    const odgovor = {
        nizNekretnina: promjene.map(id => ({
            id: id,
            klikovi: preference.klikovi[id] || 0,
            pretrage: preference.pretrage[id] || 0,
        })),
    };
    res.status(200).json(odgovor);
});

app.listen(3000);


