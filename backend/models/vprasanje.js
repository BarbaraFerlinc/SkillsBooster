const db = require('../pb');

class Vprasanje {
    static async dodaj(vprasanje, tip, kviz, odgovori) {
        try {
            const id = `${kviz}_${vprasanje.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;
            
            const novoVprasanje = {
                vprasanje: vprasanje,
                tip: tip,
                kviz: kviz,
                odgovori: odgovori
            };

            db.collection("Vprasanja").doc(id).set(novoVprasanje);
            return { message: 'Uspešno dodano vprašanje', vprasanje: novoVprasanje };
        } catch (error) {
            throw new Error('Napaka pri vstavljanju vprašanja v bazo: ' + error.message);
        }
    }

    static async vsa() {
        try {
            const vprasanjaRef = db.collection("Vprasanja");
            const response = await vprasanjaRef.get();
            const vprasanja = [];
            response.forEach(doc => {
                vprasanja.push(doc.data());
            });

            return vprasanja;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju vprašanj iz baze: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            const vprasanjaRef = db.collection("Vprasanja").doc(id);
            const response = await vprasanjaRef.get();
            const vprasanje = response.data();

            return vprasanje;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju vprašanja iz baze: ' + error.message);
        }
    }

    static async getByIds(ids) {
        try {
            const vprasanjaRef = db.collection("Vprasanja");
            const vprasanjaPromises = ids.map(id => vprasanjaRef.doc(id).get());
            const responses = await Promise.all(vprasanjaPromises);
            const vprasanja = responses.map(response => response.data());

            return vprasanja;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju vprašanj iz baze: ' + error.message);
        }
    }

    static async spremeni(id, vprasanje, tip) {
        try {
            const spremenjeno = {
                vprasanje: vprasanje,
                tip: tip
            };

            db.collection("Vprasanja").doc(id).update(spremenjeno);
            return { message: 'Uspešna posodobitev vprašanja', vprasanje: spremenjeno };
        } catch (error) {
            throw new Error('Napaka pri posodabljanju vprašanja v bazi: ' + error.message);
        }
    }

    static async dodajOdgovor(id, odgovor) {
        try {
            const vprasanjaRef = db.collection("Vprasanja").doc(id);
            const response = await vprasanjaRef.get();
            const vprasanje = response.data();

            if (vprasanje.odgovori && vprasanje.odgovori.includes(odgovor)) {
                return { message: 'Odgovor je že vključen v to vprašanje', vprasanje: vprasanje };
            }
            const updatedOdgovori = vprasanje.odgovori ? [...vprasanje.odgovori, odgovor] : [odgovor];

            db.collection("Vprasanja").doc(id).update({odgovori: updatedOdgovori});
            return { message: 'Uspešna posodobitev vprašanja', vprasanje: vprasanje };
        } catch (error) {
            throw new Error('Napaka pri pridobivanju vprašanja iz baze: ' + error.message);
        }
    }

    static async odstraniOdgovor(id, odgovor) {
        try {
            const vprasanjaRef = db.collection("Vprasanja").doc(id);
            const response = await vprasanjaRef.get();
            const vprasanje = response.data();

            if (vprasanje.odgovori && vprasanje.odgovori.includes(odgovor)) {
                const updatedOdgovori = vprasanje.odgovori.filter(obstojeciOdgovor => obstojeciOdgovor !== odgovor);

                await db.collection("Vprasanja").doc(id).update({ odgovori: updatedOdgovori });
                return { message: 'Odgovor uspešno odstranjen iz vprašanja', vprasanje: vprasanje };
            } else {
                return { message: 'Odgovor ni del tega vprašanja', vprasanje: vprasanje };
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju vprašanja iz baze: ' + error.message);
        }
    }

    static async izbrisi(id) {
        try {
            const vprasanjaRef = db.collection("Vprasanja").doc(id);
            const response = await vprasanjaRef.get();
            const vprasanje = response.data();
            if (vprasanje == undefined) {
                throw new Error('Vprašanje ne obstaja');
            }
            await db.collection("Vprasanja").doc(id).delete();

            return { message: 'Vprašanje izbrisano', vprasanje: vprasanje };
        } catch (error) {
            throw new Error('Napaka pri brisanju vprašanja iz baze: ' + error.message);
        }
    }
}

module.exports = Vprasanje;