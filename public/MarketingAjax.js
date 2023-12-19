const MarketingAjax = (() => {
    let prviKlikovi = true;
    let prviPretrage = true;
    function osvjeziPretrage(divNekretnine) {
        const propertyStan = Array.from(divNekretnine.querySelectorAll('.property-stan'));
        const propertyKuca = Array.from(divNekretnine.querySelectorAll('.property-kuca'));
        const propertyPosao = Array.from(divNekretnine.querySelectorAll('.property-posao'));
        const propertyIdsStan = propertyStan.map(propertyItem => JSON.parse(propertyItem.id));
        const propertyIdsKuca = propertyKuca.map(propertyItem => JSON.parse(propertyItem.id));
        const propertyIdsPosao = propertyPosao.map(propertyItem => JSON.parse(propertyItem.id));
        const propertyIds = [...propertyIdsStan, ...propertyIdsKuca, ...propertyIdsPosao];

        if (prviPretrage) {
            console.log("prvi put PRETRAGA");
            const ajax = new XMLHttpRequest();
            ajax.open('POST', '/marketing/osvjezi', true);
            ajax.setRequestHeader('Content-Type', 'application/json');
            prviPretrage = false;
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    const result = JSON.parse(ajax.responseText);
                    const nizNekretnina = result.nizNekretnina;
                    if (Object.keys(nizNekretnina).length != 0) {
                        nizNekretnina.forEach(item => {
                            
                            const nekretninaId = item.id;
                            const pretragaValue = item.pretrage;
                            const klikoviValue = item.klikovi;
                            const pretrageElement = divNekretnine.querySelector(`[id="${nekretninaId}"] .property-searches`);
                            const klikoviElement = divNekretnine.querySelector(`[id="${nekretninaId}"] .property-clicks`);
                            if (pretrageElement) pretrageElement.innerHTML = `<p>Pretrage: ${pretragaValue}</p>`;
                            if (klikoviElement) klikoviElement.innerHTML = `<p>Klikovi: ${klikoviValue}</p>`;
                        })
                    }
                }
            }
            prviPretrage = false;
            ajax.send(JSON.stringify({nizNekretnina: propertyIds}));

        } else {
            console.log("nije prvi put PRETRAGA");
            const ajax = new XMLHttpRequest();
            ajax.open('POST', '/marketing/osvjezi', true);
            ajax.setRequestHeader('Content-Type', 'application/json');
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    const result = JSON.parse(ajax.responseText);
                    const nizNekretnina = result.nizNekretnina;
                    if (Object.keys(nizNekretnina).length != 0) {
                        nizNekretnina.forEach(item => {
                            const nekretninaId = item.id;
                            const pretragaValue = item.pretrage;
                            const klikoviValue = item.klikovi;
                            const pretrageElement = divNekretnine.querySelector(`[id="${nekretninaId}"] .property-searches`);
                            const klikoviElement = divNekretnine.querySelector(`[id="${nekretninaId}"] .property-clicks`);
                            if (pretrageElement) pretrageElement.innerHTML = `<p>Pretrage: ${pretragaValue}</p>`;
                            if (klikoviElement) klikoviElement.innerHTML = `<p>Klikovi: ${klikoviValue}</p>`;
                        })
                    }
                }
            }
            prviPretrage = false;
            ajax.send(JSON.stringify({}));
        }
    }
      
    function osvjeziKlikove(divNekretnine) {
        const propertyStan = Array.from(divNekretnine.querySelectorAll('.property-stan'));
        const propertyKuca = Array.from(divNekretnine.querySelectorAll('.property-kuca'));
        const propertyPosao = Array.from(divNekretnine.querySelectorAll('.property-posao'));
        const propertyIdsStan = propertyStan.map(propertyItem => JSON.parse(propertyItem.id));
        const propertyIdsKuca = propertyKuca.map(propertyItem => JSON.parse(propertyItem.id));
        const propertyIdsPosao = propertyPosao.map(propertyItem => JSON.parse(propertyItem.id));
        const propertyIds = [...propertyIdsStan, ...propertyIdsKuca, ...propertyIdsPosao];

        if (prviKlikovi) {
            console.log("prvi put KLIKOVI");
            const ajax = new XMLHttpRequest();
            ajax.open('POST', '/marketing/osvjezi', true);
            ajax.setRequestHeader('Content-Type', 'application/json');
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    const result = JSON.parse(ajax.responseText);
                    const nizNekretnina = result.nizNekretnina;
                    if (Object.keys(nizNekretnina).legth != 0) {
                        nizNekretnina.forEach(item => {
                            const nekretninaId = item.id;
                            const pretragaValue = item.pretrage;
                            const klikoviValue = item.klikovi;
                            const pretrageElement = divNekretnine.querySelector(`[id="${nekretninaId}"] .property-searches`);
                            const klikoviElement = divNekretnine.querySelector(`[id="${nekretninaId}"] .property-clicks`);
                            if (pretrageElement) pretrageElement.innerHTML = `<p>Pretrage: ${pretragaValue}</p>`;
                            if (klikoviElement) klikoviElement.innerHTML = `<p>Klikovi: ${klikoviValue}</p>`;
                        });
                    }
                }
            }
            prviKlikovi = false;
            ajax.send(JSON.stringify({ nizNekretnina: propertyIds }));
            
        } else {
            console.log("nije prvi put KLIKOVI");
            const ajax = new XMLHttpRequest();
            ajax.open('POST', '/marketing/osvjezi', true);
            ajax.setRequestHeader('Content-Type', 'application/json');
            ajax.onreadystatechange = function() {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    const result = JSON.parse(ajax.responseText);
                    const nizNekretnina = result.nizNekretnina;
                    if (Object.keys(nizNekretnina).length != 0) {
                        nizNekretnina.forEach(item => {
                            const nekretninaId = item.id;
                            const pretragaValue = item.pretrage;
                            const klikoviValue = item.klikovi;
                            const pretrageElement = divNekretnine.querySelector(`[id="${nekretninaId}"] .property-searches`);
                            const klikoviElement = divNekretnine.querySelector(`[id="${nekretninaId}"] .property-clicks`);
                            if (pretrageElement) pretrageElement.innerHTML = `<p>Pretrage: ${pretragaValue}</p>`;
                            if (klikoviElement) klikoviElement.innerHTML = `<p>Klikovi: ${klikoviValue}</p>`;
                        });
                }
            }
            prviKlikovi = false;
            ajax.send(JSON.stringify({}));
        }
    }
}
      
    function novoFiltriranje(listaFiltriranihNekretnina) {
        const ids = listaFiltriranihNekretnina.map(nekretnina => nekretnina.id);
        if (ids.length === 0) {
            return;
        }
        const ajax = new XMLHttpRequest();
        ajax.open('POST', '/marketing/nekretnine', true);
        prviDetalji = true;
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.send(JSON.stringify({ nizNekretnina: ids }));
        
    }
      
    function klikNekretnina(idNekretnine) {
        const ajax = new XMLHttpRequest();
        ajax.open('POST', `/marketing/nekretnina/${idNekretnine}`, true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.send();
    }
      
    return {
        osvjeziPretrage,
        osvjeziKlikove,
        novoFiltriranje,
        klikNekretnina,
    };
})();
  