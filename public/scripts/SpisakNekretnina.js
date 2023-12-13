let SpisakNekretnina = function () {
    //privatni atributi modula
    let listaNekretnina = [];
    let listaKorisnika = [];

    let init = function (nekretnine, korisnici) {
        listaKorisnika = korisnici;
        listaNekretnina = nekretnine;
    }

    let filtrirajNekretnine = function (kriterij) {
        let filtriraneNekretnine = listaNekretnina.filter(nekretnina => {
            let uslovi = true;

           
            if (kriterij.tip_nekretnine) {
                uslovi = uslovi && nekretnina.tip_nekretnine === kriterij.tip_nekretnine;
            }

            if (kriterij.min_kvadratura) {
                uslovi = uslovi && nekretnina.kvadratura >= kriterij.min_kvadratura;
            }

            if (kriterij.max_kvadratura) {
                uslovi = uslovi && nekretnina.kvadratura <= kriterij.max_kvadratura;
            }

            if (kriterij.min_cijena) {
                uslovi = uslovi && nekretnina.cijena >= kriterij.min_cijena;
            }

          
            if (kriterij.max_cijena) {
                uslovi = uslovi && nekretnina.cijena <= kriterij.max_cijena;
            }

            return uslovi;
        });

        return filtriraneNekretnine;
    }

    let ucitajDetaljeNekretnine = function (id) {
        let nekretnina = listaNekretnina.find(nekretnina => nekretnina.id === id);
        return nekretnina || null;
    }


    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};