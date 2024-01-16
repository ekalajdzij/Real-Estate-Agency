PoziviAjax.getKorisnik((errorKorisnik, dataKorisnik) => {
    if (errorKorisnik) {
        console.error("Greška prilikom dohvata korisnika.");
        return;
    } else {
        postaviUpitDiv.innerHTML = `
            <h3>Postavite upit</h3>
            <input type="text" id="tekstUpita" placeholder="Unesite vaš upit">
            <button type="button" id="posaljiUpit" onclick="posaljiUpit(${nekretninaId})">Pošalji Upit</button>
        `;
    }
});
function posaljiUpit() {
    const tekstUpita = document.getElementById('tekstUpita').value;
    PoziviAjax.postUpit(parseInt(nekretninaId, 10), tekstUpita, (errorUpit, rezultatUpit) => {
        if (errorUpit) {
            alert('Došlo je do greške prilikom slanja upita. Pokušajte ponovo.');
        } else {
            alert('Upit uspješno poslan!');
            location.reload();
        }
    });
}