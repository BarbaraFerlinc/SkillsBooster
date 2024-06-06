const db = require('../pb');
const bcrypt = require('bcrypt');

class Uporabnik {
    static async dodaj(ime_priimek, email, geslo, vloga) {
        try {
            if (this.getById(email) == undefined) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(geslo, saltRounds);

                const id = email;
                const newUser = {
                    ime_priimek: ime_priimek,
                    email: email,
                    geslo: hashedPassword,
                    vloga: vloga
                };

                db.collection("Uporabniki").doc(id).set(newUser);
                return { message: 'Uspešna registracija', user: newUser };
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
            const users = [];
            response.forEach(doc => {
                users.push(doc.data());
            });

            return users;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju uporabnikov iz baze: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            const uporabnikiRef = db.collection("Uporabniki").doc(id);
            const response = await uporabnikiRef.get();
            const user = response.data();

            return user;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju uporabnika iz baze: ' + error.message);
        }
    }

    static async spremeni(ime_priimek, email, geslo, vloga) {
        try {
            if (this.getById(email) != undefined) {
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(geslo, saltRounds);

                const id = email;
                const user = {
                    ime_priimek: ime_priimek,
                    email: email,
                    geslo: hashedPassword,
                    vloga: vloga
                };

                db.collection("Uporabniki").doc(id).update(user);
                return { message: 'Uspešna posodobitev uporabnika', user: user };
            } else {
                return { message: 'Neuspešna posodobitev uporabnika', user: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri posodabljanju uporabnika v bazi: ' + error.message);
        }
    }

    static async izbrisi(id) {
        try {
            const uporabnikiRef = db.collection("Uporabniki").doc(id);
            const response = await uporabnikiRef.get();
            const user = response.data();
            if (user == undefined) {
                throw new Error('Uporabnik ne obstaja');
            }
            await db.collection("Uporabniki").doc(id).delete();

            return { message: 'Uporabnik izbrisan', user: user };
        } catch (error) {
            throw new Error('Napaka pri brisanju uporabnika iz baze: ' + error.message);
        }
    }
}

module.exports = Uporabnik;