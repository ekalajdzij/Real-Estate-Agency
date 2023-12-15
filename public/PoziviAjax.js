const PoziviAjax = (() => {

    function impl_getKorisnik(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.open('GET', '/korisnik', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                fnCallback(null, response);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText,null);
        }
        ajax.send();
    };

    function impl_putKorisnik(noviPodaci, fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.open('PUT', '/korisnik', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                fnCallback(null, response);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText,null);
        };
        ajax.send(JSON.stringify(noviPodaci));
    }

    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.open('POST', '/upit', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                fnCallback(null, response);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText,null);
        };
        ajax.send(JSON.stringify({nekretnina_id, tekst_upita}));
    } 

    function impl_getNekretnine(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.open('GET', '/nekretnine', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                fnCallback(null, response);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText,null);

        };
        ajax.send();
    }

    function impl_postLogin(username, password, fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.open('POST', '/login', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                fnCallback(null, response);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText,null);
        };
        ajax.send(JSON.stringify({username, password}));
    } 

    function impl_postLogout(fnCallback) {
        let ajax = new XMLHttpRequest();
        ajax.open('POST', '/logout', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
                fnCallback(null, response);
            }
            else if (ajax.readyState == 4)
                fnCallback(ajax.statusText,null);
        };
        ajax.send();
    } 

    return {
        postLogin: impl_postLogin,//dodano
        postLogout: impl_postLogout,//dodano
        getKorisnik: impl_getKorisnik,//dodano
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine//dodano
    };
})();