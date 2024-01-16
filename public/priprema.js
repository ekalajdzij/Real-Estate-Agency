const db = require('./baza.js');

async function inicializacija() {
    try {
        const nekretninePromise = [
            db.Nekretnina.create({
                tip_nekretnine: 'Stan',
                naziv: 'Useljiv stan Sarajevo',
                kvadratura: 58,
                cijena: 232000,
                tip_grijanja: 'plin',
                lokacija: 'Novo Sarajevo',
                godina_izgradnje: 2019,
                datum_objave: '2023-10-01',
                opis: 'Sociis natoque penatibus'
            }),
            db.Nekretnina.create({
                tip_nekretnine: 'Poslovni prostor',
                naziv: 'Mali poslovni prostor',
                kvadratura: 20,
                cijena: 70000,
                tip_grijanja: 'struja',
                lokacija: 'Centar',
                godina_izgradnje: 2005,
                datum_objave: '2023-08-20',
                opis: 'Magnis dis parturient montes'
            }),
            db.Nekretnina.create({
                tip_nekretnine: 'Stan',
                naziv: 'Useljiv stan Sarajevo',
                kvadratura: 58,
                cijena: 232000,
                tip_grijanja: 'plin',
                lokacija: 'Novo Sarajevo',
                godina_izgradnje: 2019,
                datum_objave: '2023-10-01',
                opis: 'Sociis natoque penatibus'
            }),
            db.Nekretnina.create({
                tip_nekretnine: 'Kuca',
                naziv: 'Useljiv stan Sarajevo',
                kvadratura: 158,
                cijena: 232000,
                tip_grijanja: 'plin',
                lokacija: 'Novo Sarajevo',
                godina_izgradnje: 2019,
                datum_objave: '2023-10-01',
                opis: 'Sociis natoque penatibus'
            }),
            db.Nekretnina.create({
                tip_nekretnine: 'Stan',
                naziv: 'Useljiv stan Sarajevo',
                kvadratura: 258,
                cijena: 232000,
                tip_grijanja: 'plin',
                lokacija: 'Novo Sarajevo',
                godina_izgradnje: 2019,
                datum_objave: '2023-10-01',
                opis: 'Sociis natoque penatibus'
            }),
            db.Nekretnina.create({
                tip_nekretnine: 'Stan',
                naziv: 'Useljiv stan Sarajevo',
                kvadratura: 558,
                cijena: 2322000,
                tip_grijanja: 'plin',
                lokacija: 'Novo Sarajevo',
                godina_izgradnje: 2019,
                datum_objave: '2023-10-01',
                opis: 'Sociis natoque penatibus'
            }),
            db.Nekretnina.create({
                tip_nekretnine: 'Poslovni prostor',
                naziv: 'Mali poslovni prostor',
                kvadratura: 20,
                cijena: 70000,
                tip_grijanja: 'struja',
                lokacija: 'Centar',
                godina_izgradnje: 2005,
                datum_objave: '2023-08-20',
                opis: 'Magnis dis parturient montes'
            }),
            db.Nekretnina.create({
                tip_nekretnine: 'Kuca',
                naziv: 'Useljiva kuca Sarajevo',
                kvadratura: 320,
                cijena: 500000,
                tip_grijanja: 'struja',
                lokacija: 'Centar',
                godina_izgradnje: 2018,
                datum_objave: '2023-10-05',
                opis: 'Sociis natoque penatibus',
                createdAt: '2024-01-06 12:48:57',
                updatedAt: '2024-01-06 12:48:57'
            })
        ];

        const korisniciPromise = [
            db.Korisnik.create({
                ime: 'John1',
                prezime: 'MalkovichProba1',
                username: 'username1',
                password: '$2b$10$KWK78nBqo460dIxar1PFpugT1P2NcUguEvkLhZE43p3mpTormMGxi'
            }),
            db.Korisnik.create({
                ime: 'John2',
                prezime: 'MalkovichProba2',
                username: 'username2',
                password: '$2b$10$juxck5e5odgN7tVrj0LHoOeyjqwy3eQj8nblWBhFbrt99p/klgK0m'
            })
        ];

        const upitiPromise = [
            db.Upit.create({
                tekst_upita: 'Nullam eu pede mollis pretium.',
                nekretnina_id: 1,
                korisnik_id: 1
            }),
            db.Upit.create({
                tekst_upita: 'Phasellus viverra nulla.',
                nekretnina_id: 1,
                korisnik_id: 2
            }),
            db.Upit.create({
                tekst_upita: 'Prelijepoxxxxx',
                nekretnina_id: 1,
                korisnik_id: 1
            }),
            db.Upit.create({
                tekst_upita: 'Proba upisa',
                nekretnina_id: 1,
                korisnik_id: 2
            }),
            db.Upit.create({
                tekst_upita: 'Proba upisa',
                nekretnina_id: 1,
                korisnik_id: 2
            }),
            db.Upit.create({
                tekst_upita: 'Integer tincidunt.',
                nekretnina_id: 2,
                korisnik_id: 2
            }),
            db.Upit.create({
                tekst_upita: 'Nullam eu pede mollis pretium.',
                nekretnina_id: 3,
                korisnik_id: 1
            }),
            db.Upit.create({
                tekst_upita: 'Phasellus viverra nulla.',
                nekretnina_id: 3,
                korisnik_id: 2
            }),
            db.Upit.create({
                tekst_upita: 'Nullam eu pede mollis pretium.',
                nekretnina_id: 4,
                korisnik_id: 1
            }),
            db.Upit.create({
                tekst_upita: 'Phasellus viverra nulla.',
                nekretnina_id: 4,
                korisnik_id: 2
            }),
            db.Upit.create({
                tekst_upita: 'Nullam eu pede mollis pretium.',
                nekretnina_id: 5,
                korisnik_id: 1
            }),
            db.Upit.create({
                tekst_upita: 'Phasellus viverra nulla.',
                nekretnina_id: 5,
                korisnik_id: 2
            }),
            db.Upit.create({
                tekst_upita: 'Integer tincidunt.',
                nekretnina_id: 7,
                korisnik_id: 2
            }),
            db.Upit.create({
                tekst_upita: 'Savršena',
                nekretnina_id: 7,
                korisnik_id: 1
            }),
            db.Upit.create({
                tekst_upita: 'Savršena',
                nekretnina_id: 5,
                korisnik_id: 1
            }),
            db.Upit.create({
                tekst_upita: 'proba',
                nekretnina_id: 8,
                korisnik_id: 1
            }),
            db.Upit.create({
                tekst_upita: 'Postavljam upit za nekretninu sa id-ijem 3.',
                nekretnina_id: 3,
                korisnik_id: 1
            }), 
            db.Upit.create({
                tekst_upita: 'Proba inicializacija metode',
                nekretnina_id: 3,
                korisnik_id: 1
            })
        ];

    
        await Promise.all([...upitiPromise, ...korisniciPromise, ...nekretninePromise]);

        const preferencaPromise = [
            db.Preferenca.create({
                nekretnina_id: 1,
                pretrage: 533,
                klikovi: 132,
                createdAt: '2024-01-06 12:48:57',
                updatedAt: '2024-01-06 12:48:57'
            }),
            db.Preferenca.create({
                nekretnina_id: 2,
                pretrage: 533,
                klikovi: 50,
                createdAt: '2024-01-06 12:48:57',
                updatedAt: '2024-01-06 12:48:57'
            }),
            db.Preferenca.create({
                nekretnina_id: 3,
                pretrage: 533,
                klikovi: 82,
                createdAt: '2024-01-06 12:48:57',
                updatedAt: '2024-01-06 12:48:57'
            }),
            db.Preferenca.create({
                nekretnina_id: 4,
                pretrage: 534,
                klikovi: 41,
                createdAt: '2024-01-06 12:48:57',
                updatedAt: '2024-01-06 12:48:57'
            }),
            db.Preferenca.create({
                nekretnina_id: 5,
                pretrage: 527,
                klikovi: 16,
                createdAt: '2024-01-06 12:48:57',
                updatedAt: '2024-01-06 12:48:57'
            }),
            db.Preferenca.create({
                nekretnina_id: 6,
                pretrage: 526,
                klikovi: 28,
                createdAt: '2024-01-06 12:48:57',
                updatedAt: '2024-01-06 12:48:57'
            }),
            db.Preferenca.create({
                nekretnina_id: 7,
                pretrage: 532,
                klikovi: 230,
                createdAt: '2024-01-06 12:48:57',
                updatedAt: '2024-01-06 12:48:57'
            }),
            db.Preferenca.create({
                nekretnina_id: 8,
                pretrage: 127,
                klikovi: 30,
                createdAt: '2024-01-06 12:48:57',
                updatedAt: '2024-01-06 12:48:57'
            })
        ];
        await Promise.all([...preferencaPromise]);

        console.log("Gotova inicijalizacija tabela!");
    } catch (error) {
        console.error("Greška prilikom inicijalizacije tabela: ", error);
        process.exit(1);
    }
}

inicializacija();
