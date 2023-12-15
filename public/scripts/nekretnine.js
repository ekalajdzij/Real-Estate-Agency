const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

let listaNekretnina = [];
let listaKorisnika = [];

PoziviAjax.getNekretnine((errorNekretnine, dataNekretnine) => {
    if (errorNekretnine) {
        console.error('Greška prilikom dohvata nekretnina:', errorNekretnine);
        return;
    }

    PoziviAjax.getKorisnik((errorKorisnik, dataKorisnik) => {
        if (errorKorisnik) {
            console.error('Greška prilikom dohvata korisnika:', errorKorisnik);
        }

        listaNekretnina = dataNekretnine;
        listaKorisnika = dataKorisnik;

        
        let nekretnine = SpisakNekretnina();
        nekretnine.init(listaNekretnina, listaKorisnika);
        spojiNekretnine(divStan, nekretnine, "Stan");
        spojiNekretnine(divKuca, nekretnine, "Kuca");
        spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
    });
});
let min_kvadratura = 0;
let max_kvadratura = 0;
let min_cijena = 0;
let max_cijena = 0;
document.addEventListener("DOMContentLoaded", function () {
    const minCijenaInput = document.getElementById("min-cijena");
    const maxCijenaInput = document.getElementById("max-cijena");
    const minKvadraturaInput = document.getElementById("min-kvadratura");
    const maxKvadraturaInput = document.getElementById("max-kvadratura");
    const filterButton = document.getElementById("filter-button");

    filterButton.addEventListener("click", function () {
    
        min_kvadratura =  parseInt(minKvadraturaInput.value);
        max_kvadratura = parseInt(maxKvadraturaInput.value);
        min_cijena = parseInt(minCijenaInput.value);
        max_cijena =  parseInt(maxCijenaInput.value);
        let nekretnine = SpisakNekretnina();
        nekretnine.init(listaNekretnina, listaKorisnika);
        spojiNekretnine(divStan, nekretnine, "Stan");
        spojiNekretnine(divKuca, nekretnine, "Kuca");
        spojiNekretnine(divPp, nekretnine, "Poslovni prostor");


        //console.log(min_kvadratura, max_kvadratura, min_cijena, max_cijena);
    });
});
function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine, min_cijena: min_cijena, max_cijena: max_cijena, min_kvadratura: min_kvadratura, max_kvadratura: max_kvadratura});

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
        nekretninaElement.innerHTML = `
        <div class="property-details">
        <img class="property-image" src="https://hips.hearstapps.com/hmg-prod/images/beautiful-sunny-forest-wild-nature-outdoor-travel-royalty-free-image-1576784717.jpg">
            <div class="property-name">${nekretnina.naziv}</div>
            <div class="property-area">Kvadratura: ${nekretnina.kvadratura} m2</div>
            <div class="property-price">Cijena: ${nekretnina.cijena} BAM</div>
            <div class="property-clicks" id = "klikovi-idNekretnine">Klikovi: </div>
            <div class="property-searches" id = "pretrage-idNekretnine">Pretrage: </div>
            <button type="button">Detalji</button>
        </div>
        `;

        propertyList.appendChild(nekretninaElement);
    });
}