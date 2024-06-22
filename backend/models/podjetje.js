const db = require('../pb');

class Podjetje {
    static async dodaj(naziv, naslov, postna_stevilka, admin_email) {
        try {
            if (this.getById(admin_email) == undefined) {

                const id = admin_email.split('@')[1];
                const novoPodjetje = {
                    naziv: naziv,
                    naslov: naslov,
                    postna_stevilka: postna_stevilka
                };

                db.collection("Podjetja").doc(id).set(novoPodjetje);
                return { message: 'Uspešno dodano podjetje', podjetje: novoPodjetje };
            } else {
                return { message: 'Neuspešno dodano podejtje', podjetje: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri vstavljanju podjetja v bazo: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            const podjetjeRef = db.collection("Podjetja").doc(id);
            const response = await podjetjeRef.get();
            const podjetje = response.data();

            return podjetje;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju podjetja iz baze: ' + error.message);
        }
    }

    static async spremeni(id, naziv, naslov, postna_stevilka) {
        try {
            if (this.getById(id) != undefined) {

                const podjetje = {
                    naziv: naziv,
                    naslov: naslov,
                    postna_stevilka: postna_stevilka
                };

                db.collection("Podjetja").doc(id).update(podjetje);
                return { message: 'Uspešna posodobitev podjetja', podjetje: podjetje };
            } else {
                return { message: 'Neuspešna posodobitev podjetja', podjetje: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri posodabljanju podjetja v bazi: ' + error.message);
        }
    }

    static async izbrisi(id) {
        try {
            const podjetjeRef = db.collection("Podjetja").doc(id);
            const response = await podjetjeRef.get();
            const podjetje = response.data();
            if (podjetje == undefined) {
                throw new Error('Podjetje ne obstaja');
            }
            await db.collection("Podjetja").doc(id).delete();

            return { message: 'Podjetje izbrisano', user: user };
        } catch (error) {
            throw new Error('Napaka pri brisanju podjetja iz baze: ' + error.message);
        }
    }
}

module.exports = Podjetje;