const osnovnoDiv = document.getElementById("osnovno");
const detaljiDiv = document.getElementById("detalji");
const upitDiv = document.getElementById("upiti");
const postaviUpitDiv = document.getElementById("postaviUpit");
const urlParams = new URLSearchParams(window.location.search);
const nekretninaId = urlParams.get('nekretninaId');

PoziviAjax.getDetalji(nekretninaId, (error, dataDetalji) => {
    if (error) {
        console.error("Greška prilikom dohvata detalja.");
        return;
    }
    detalji = dataDetalji;

    osnovnoDiv.innerHTML = `
        <img src="https://images.unsplash.com/photo-1538100522992-760b4cdec3f1?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Slika nekretnine">
        <p><strong>Naziv:</strong> ${detalji.naziv}</p>
        <p><strong>Kvadratura:</strong> ${detalji.kvadratura} m²</p>
        <p><strong>Cijena:</strong> ${detalji.cijena} BAM</p>
    `;
    detaljiDiv.innerHTML = `
        <div>
            <p><strong>Tip grijanja:</strong> ${detalji.tip_grijanja}</p>
            <p><strong>Lokacija:</strong> ${detalji.lokacija}</p>
        </div>
        <div>
            <p><strong>Godina izgradnje:</strong> ${detalji.godina_izgradnje}</p>
            <p><strong>Datum objave oglasa:</strong> ${detalji.datum_objave}</p>
        </div>
        <p><strong>Opis:</strong> ${detalji.opis}</p>
        `;

    PoziviAjax.getUpiti(nekretninaId, (errorUpiti, dataUpiti) => {
        if (errorUpiti) {
            console.error("Greška prilikom dohvata upita.");
            return;
        }

        if (dataUpiti && dataUpiti.length > 0) {
            const upitiList = dataUpiti.map(upit => `
                <li>
                    <p><strong>${upit.Korisnik.username}</strong></p>
                    <p>${upit.tekst_upita}</p>
                </li>
            `).join('');

            upitDiv.innerHTML = `
                <ul>${upitiList}</ul>
            `;
        } else {
            upitDiv.innerHTML = '<p>Nema upita za ovu nekretninu.</p>';
        }
    });
});