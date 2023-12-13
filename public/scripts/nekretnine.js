const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

PoziviAjax.getNekretnine((errorNekretnine, dataNekretnine) => {
    if (errorNekretnine) {
        console.error('Greška prilikom dohvata nekretnina:', errorNekretnine);
        return;
    }

    PoziviAjax.getKorisnik((errorKorisnik, dataKorisnik) => {
        if (errorKorisnik) {
            console.error('Greška prilikom dohvata korisnika:', errorKorisnik);
        }

        const listaNekretnina = dataNekretnine;
        const listaKorisnika = dataKorisnik;

        spojiNekretnine(divStan, listaNekretnina, listaKorisnika, "Stan");
        spojiNekretnine(divKuca, listaNekretnina, listaKorisnika, "Kuca");
        spojiNekretnine(divPp, listaNekretnina, listaKorisnika, "Poslovni prostor");
    });
});

function spojiNekretnine(divReferenca, listaNekretnina, listaKorisnika, tip_nekretnine) {
    const filtriraneNekretnine = listaNekretnina.filter(nekretnina => nekretnina.tip_nekretnine === tip_nekretnine);

    if (!divReferenca) return;

    divReferenca.innerHTML = "";
    divReferenca.classList.add('property-type');

    if (filtriraneNekretnine.length === 0) {
        divReferenca.innerHTML = "<p>Nema dostupnih nekretnina.</p>";
        return;
    }

    const propertyList = document.createElement("div");
    propertyList.classList.add("property-list");
    divReferenca.appendChild(propertyList);

    filtriraneNekretnine.forEach(nekretnina => {
        const nekretninaElement = document.createElement("div");

        if (tip_nekretnine == "Stan") {
            nekretninaElement.classList.add("property-stan")
        } else if (tip_nekretnine == "Kuca") {
            nekretninaElement.classList.add("property-kuca")
        } else if (tip_nekretnine == "Poslovni prostor") {
            nekretninaElement.classList.add("property-posao")
        }
        
        if (Array.isArray(listaKorisnika)) {const korisnik = listaKorisnika.find(user => user.id === nekretnina.upiti[0].korisnik_id);}
        else korisnik = listaKorisnika;

        nekretninaElement.innerHTML = `
            <div class="property-details">
                <img class="property-image" src="https://hips.hearstapps.com/hmg-prod/images/beautiful-sunny-forest-wild-nature-outdoor-travel-royalty-free-image-1576784717.jpg">
                <div class="property-name">${nekretnina.naziv}</div>
                <div class="property-area">Kvadratura: ${nekretnina.kvadratura} m2</div>
                <div class="property-price">Cijena: ${nekretnina.cijena} BAM</div>
                <button type="button">Detalji</button>
            </div>
        `;

        propertyList.appendChild(nekretninaElement);
    });
}


