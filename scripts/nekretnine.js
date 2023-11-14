import { SpisakNekretnina } from "./SpisakNekretnina.js";
function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });

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
        <img class="property-image" src="https://hips.hearstapps.com/hmg-prod/images/beautiful-sunny-forest-wild-nature-outdoor-travel-royalty-free-image-1576784717.jpg" alt="Poslovni prostor 1">
            <div class="property-name">${nekretnina.naziv}</div>
            <div class="property-area">Kvadratura: ${nekretnina.kvadratura} m2</div>
            <div class="property-price">Cijena: ${nekretnina.cijena} BAM</div>
            <button type="button">Detalji</button>
        </div>
        `;

        propertyList.appendChild(nekretninaElement);
    });
}

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 158,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 3,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 4,
    tip_nekretnine: "Kuca",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 158,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 5,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
}]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]


let nekretnine = SpisakNekretnina();
nekretnine.init(listaNekretnina, listaKorisnika);

spojiNekretnine(divStan, nekretnine, "Stan");
spojiNekretnine(divKuca, nekretnine, "Kuca");
spojiNekretnine(divPp, nekretnine, "Poslovni prostor");
