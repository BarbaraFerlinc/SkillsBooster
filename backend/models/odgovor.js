const db = require('../pb');

class Odgovor {
    static async dodaj(odgovor, tip) {
        try {
            const id = odgovor.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            if (this.getById(id) == undefined) {
                const novOdgovor = {
                    odgovor: odgovor,
                    tip: tip
                };

                db.collection("Odgovori").doc(id).set(novOdgovor);
                return { message: 'Uspešno dodan odgovor', odgovor: novOdgovor };
            } else {
                return { message: 'Neuspešno dodan odgovor', odgovor: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri vstavljanju odgovora v bazo: ' + error.message);
        }
    }

    static async vsi() {
        try {
            const odgovoriRef = db.collection("Odgovori");
            const response = await odgovoriRef.get();
            const odgovori = [];
            response.forEach(doc => {
                odgovori.push(doc.data());
            });

            return odgovori;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju odgovorov iz baze: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            const odgovoriRef = db.collection("Odgovori").doc(id);
            const response = await odgovoriRef.get();
            const odgovor = response.data();

            return odgovor;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju odgovora iz baze: ' + error.message);
        }
    }

    static async spremeni(id, odgovor, tip) {
        try {
            if (this.getById(id) != undefined) {
                const spremenjen = {
                    odgovor: odgovor,
                    tip: tip
                };

                db.collection("Odgovori").doc(id).update(spremenjen);
                return { message: 'Uspešna posodobitev odgovora', odgovor: spremenjen };
            } else {
                return { message: 'Neuspešna posodobitev odgovora', odgovor: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri posodabljanju odgovora v bazi: ' + error.message);
        }
    }

    static async izbrisi(id) {
        try {
            const odgovoriRef = db.collection("Odgovori").doc(id);
            const response = await odgovoriRef.get();
            const odgovor = response.data();
            if (odgovor == undefined) {
                throw new Error('Odgovor ne obstaja');
            }
            await db.collection("Odgovori").doc(id).delete();

            return { message: 'Odgovor izbrisan', odgovor: odgovor };
        } catch (error) {
            throw new Error('Napaka pri brisanju odgovora iz baze: ' + error.message);
        }
    }
}

module.exports = Odgovor;