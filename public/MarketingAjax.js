const MarketingAjax = (() => {
    function osvjeziPretrage(divNekretnine) {
        const nekretnine = divNekretnine.querySelectorAll('.property-details');
        const ids = Array.from(nekretnine).map(nekretnina => {
            const idString = nekretnina.querySelector('button').dataset.idNekretnine;
            ids =  parseInt(idString, 10);
        });
        let ajax = new XMLHttpRequest();
        ajax.open('POST', '/marketing/osvjezi', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
            }
            else if (ajax.readyState == 4)
                console.error(ajax.statusText);
        }
        ajax.send(JSON.stringify({ nizNekretnina: ids }));
    }
      
    function osvjeziKlikove(divNekretnine) {
        const nekretnine = divNekretnine.querySelectorAll('.property-details');
        const ids = Array.from(nekretnine).map(nekretnina => {
            const idString = nekretnina.querySelector('button').dataset.idNekretnine;
            ids =  parseInt(idString, 10);
        });
        let ajax = new XMLHttpRequest();
        ajax.open('POST', '/marketing/osvjezi', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
            }
            else if (ajax.readyState == 4)
                console.error(ajax.statusText);
        }
        ajax.send(JSON.stringify({ nizNekretnina: ids }));
    }
      
    function novoFiltriranje(listaFiltriranihNekretnina) {
        const ids = listaFiltriranihNekretnina.map(nekretnina => nekretnina.id);
        if (ids.length === 0) {
            return;
        }
        const ajax = new XMLHttpRequest();
        ajax.open('POST', '/marketing/nekretnine', true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
            }
            else if (ajax.readyState == 4) {
                console.error(ajax.statusText);
            }
        };

        ajax.send(JSON.stringify({ nizNekretnina: ids }));
        
    }
      
    function klikNekretnina(idNekretnine) {
        const ajax = new XMLHttpRequest();
        ajax.open('POST', `/marketing/nekretnina/${idNekretnine}`, true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4 && ajax.status == 200) {
                var response = JSON.parse(ajax.responseText);
            }
            else if (ajax.readyState == 4) {
                console.error(ajax.statusText);
            }
        };

        ajax.send();
    }
      
    return {
        osvjeziPretrage,
        osvjeziKlikove,
        novoFiltriranje,
        klikNekretnina,
    };
})();
  