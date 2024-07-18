const db = require('../pb');
const bcrypt = require('bcrypt');

class Uporabnik {
    static async dodaj(ime_priimek, email, geslo, vloga, admin, original_geslo) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(geslo, saltRounds);
            console.log("Geslo: ", geslo, " in ", original_geslo);

            // potem original geslo namesto v bazo, pošlje na mail uporabnika
            const id = email;
            const novUporabnik = {
                ime_priimek: ime_priimek,
                email: email,
                geslo: hashedPassword,
                vloga: vloga,
                admin: admin,
                original_geslo: original_geslo
            };

            db.collection("Uporabniki").doc(id).set(novUporabnik);
            return { message: 'Uspešna registracija', user: novUporabnik };
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

    static async getByAdmin(adminEmail) {
        try {
            const podjetje = adminEmail.split('@')[1];

            const uporabnikiRef = db.collection("Uporabniki");
            const response = await uporabnikiRef.get();
            const uporabniki = [];
            response.forEach(doc => {
                const data = doc.data();
                const admin = data.admin;
                const email = data.email;
                if (email && admin && admin.split('@')[1] === podjetje && email != adminEmail) {
                    uporabniki.push(data);
            }
            });

            return uporabniki;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju uporabnikov iz baze: ' + error.message);
        }
    }

    static async getByBoss(bossEmail, adminEmail) {
        try {
            const podjetje = adminEmail.split('@')[1];

            const uporabnikiRef = db.collection("Uporabniki");
            const response = await uporabnikiRef.get();
            const uporabniki = [];
            response.forEach(doc => {
                const data = doc.data();
                const admin = data.admin;
                const email = data.email;
                if (email && admin && admin.split('@')[1] === podjetje && email != adminEmail && email != bossEmail) {
                    uporabniki.push(data);
            }
            });

            return uporabniki;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju uporabnikov iz baze: ' + error.message);
        }
    }

    static async spremeni(id, ime_priimek, email, geslo, vloga, admin) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(geslo, saltRounds);

            const uporabnik = {
                ime_priimek: ime_priimek,
                email: email,
                geslo: hashedPassword,
                vloga: vloga,
                admin: admin
            };

            db.collection("Uporabniki").doc(id).update(uporabnik);
            return { message: 'Uspešna posodobitev uporabnika', user: uporabnik };
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