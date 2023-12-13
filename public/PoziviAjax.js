const PoziviAjax = (() => {

    // fnCallback se u svim metodama poziva kada stigne
    // odgovor sa servera putem Ajax-a
    // svaki callback kao parametre ima error i data,
    // error je null ako je status 200 i data je tijelo odgovora
    // ako postoji greška, poruka se prosljeđuje u error parametru
    // callback-a, a data je tada null

    // vraća korisnika koji je trenutno prijavljen na sistem
    function impl_getKorisnik(fnCallback) {
        fetch('/korisnik', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            fnCallback(null, data);
        })
        .catch(error => {
            fnCallback(error, null);
        });
    }    
    // ažurira podatke loginovanog korisnika
    function impl_putKorisnik(noviPodaci, fnCallback) {
        fetch('/korisnik', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noviPodaci)
        })
        .then(response => response.json())
        .then(data => {
            fnCallback(null, data);
        })
        .catch(error => {
            fnCallback(error, null);
        }); 
    }

    // dodaje novi upit za trenutno loginovanog korisnika
    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        fetch('/upit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nekretnina_id, tekst_upita})
        })
        .then(response => response.json())
        .then(data => {
            fnCallback(null, data);
        })
        .catch(error => {
            fnCallback(error, null);
        });
    }

    function impl_getNekretnine(fnCallback) {
        fetch('/nekretnine', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            fnCallback(null, data);
        })
        .catch(error => {
            fnCallback(error, null);
        });
    }

    function impl_postLogin(username, password, fnCallback) {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        })
        .then(response => response.json())
        .then(data => {
            fnCallback(null, data);
        })
        .catch(error => {
            fnCallback(error, null);
        });
    }

    function impl_postLogout(fnCallback) {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            fnCallback(null, data);
        })
        .catch(error => {
            fnCallback(error, null);
        });
    }

    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine
    };
})();