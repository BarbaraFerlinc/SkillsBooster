const db = require('../pb');
const bcrypt = require('bcrypt');

class Uporabnik {
    static async dodaj(ime_priimek, email, geslo, vloga) {
        try {
            if (this.getById(email) == undefined) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(geslo, saltRounds);

                const id = email;
                const novUporabnik = {
                    ime_priimek: ime_priimek,
                    email: email,
                    geslo: hashedPassword,
                    vloga: vloga
                };

                db.collection("Uporabniki").doc(id).set(novUporabnik);
                return { message: 'Uspešna registracija', user: novUporabnik };
            } else {
                return { message: 'Neuspešna registracija', user: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri vstavljanju uporabnika v bazo: ' + error.message);
        }
    }

    static async vsi() {
        try {
            const uporabnikiRef = db.collection("Uporabniki");
            const response = await uporabnikiRef.get();
            const uporabniki = [];
            response.forEach(doc => {
                uporabniki.push(doc.data());
            });

            return uporabniki;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju uporabnikov iz baze: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            const uporabnikRef = db.collection("Uporabniki").doc(id);
            const response = await uporabnikRef.get();
            const uporabnik = response.data();

            return uporabnik;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju uporabnika iz baze: ' + error.message);
        }
    }

    static async spremeni(id, ime_priimek, email, geslo, vloga) {
        try {
            if (this.getById(email) != undefined) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(geslo, saltRounds);

                const id = id;
                const uporabnik = {
                    ime_priimek: ime_priimek,
                    email: email,
                    geslo: hashedPassword,
                    vloga: vloga
                };

                db.collection("Uporabniki").doc(id).update(uporabnik);
                return { message: 'Uspešna posodobitev uporabnika', user: uporabnik };
            } else {
                return { message: 'Neuspešna posodobitev uporabnika', user: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri posodabljanju uporabnika v bazi: ' + error.message);
        }
    }

    static async izbrisi(id) {
        try {
            const uporabnikRef = db.collection("Uporabniki").doc(id);
            const response = await uporabnikRef.get();
            const uporabnik = response.data();
            if (uporabnik == undefined) {
                throw new Error('Uporabnik ne obstaja');
            }
            await db.collection("Uporabniki").doc(id).delete();

            return { message: 'Uporabnik izbrisan', user: uporabnik };
        } catch (error) {
            throw new Error('Napaka pri brisanju uporabnika iz baze: ' + error.message);
        }
    }
}

module.exports = Uporabnik;