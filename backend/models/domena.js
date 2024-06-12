const db = require('../pb');
const { storage, ref, uploadBytes, deleteObject } = require('../firebase');

class Domena {
    static async dodaj(naziv, opis, kljucna_znanja, lastnik) {
        try {
            const id = naziv.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

            const prazno = Buffer.alloc(0);
            const folder = ref(storage, `${id}/.placeholder`);
            uploadBytes(folder, prazno).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            }).catch((error) => {
                console.error('Error uploading file:', error);
            });

            if (this.getById(id) == undefined) {
                const novaDomena = {
                    naziv: naziv,
                    opis: opis,
                    kljucna_znanja: kljucna_znanja,
                    lastnik: lastnik
                };

                db.collection("Domene_znanja").doc(id).set(novaDomena);
                return { message: 'Uspešno dodana domena', domena: novaDomena };
            } else {
                return { message: 'Neuspešno dodana domena', domena: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri vstavljanju domene v bazo: ' + error.message);
        }
    }

    static async vse() {
        try {
            const domeneRef = db.collection("Domene_znanja");
            const response = await domeneRef.get();
            const domene = [];
            response.forEach(doc => {
                domene.push(doc.data());
            });

            return domene;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domen iz baze: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();

            return domena;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async getByUser(id) {
        try {
            const domeneRef = db.collection("Domene_znanja");
            const response = await domeneRef.where('zaposleni', 'array-contains', `${id}`).get();
            const domene = [];
            response.forEach(doc => {
                domene.push(doc.data());
            });

            return domene;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domen iz baze: ' + error.message);
        }
    }

    static async getByOwner(id) {
        try {
            const domeneRef = db.collection("Domene_znanja");
            const response = await domeneRef.where('lastnik', '==', `${id}`).get();
            const domene = [];
            response.forEach(doc => {
                domene.push(doc.data());
            });

            return domene;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domen iz baze: ' + error.message);
        }
    }

    static async spremeni(id, naziv, opis, kljucna_znanja) {
        try {
            if (this.getById(id) != undefined) {
                const domena = {
                    naziv: naziv,
                    opis: opis,
                    kljucna_znanja: kljucna_znanja
                };

                db.collection("Domene_znanja").doc(id).update(domena);
                return { message: 'Uspešna posodobitev domene', domena: domena };
            } else {
                return { message: 'Neuspešna posodobitev domene', domena: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri posodabljanju domene v bazi: ' + error.message);
        }
    }

    static async dodajUporabnika(id, uporabnikId) {
        try {
            if (this.getById(id) != undefined) {
                const domenaRef = db.collection("Domene_znanja").doc(id);
                const response = await domenaRef.get();
                const domena = response.data();

                if (domena.zaposleni && domena.zaposleni.includes(uporabnikId)) {
                    return { message: 'Uporabnik je že vključen v to domeno', domena: domena };
                }
                const updatedZaposleni = domena.zaposleni ? [...domena.zaposleni, uporabnikId] : [uporabnikId];

                db.collection("Domene_znanja").doc(id).update({zaposleni: updatedZaposleni});
                return { message: 'Uspešna posodobitev domene', domena: domena };
            } else {
                return { message: 'Neuspešna posodobitev domene', domena: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    // v kviz.js??
    static async dodajKviz(id, kvizId) {
        try {
            if (this.getById(id) != undefined) {
                const domenaRef = db.collection("Domene_znanja").doc(id);
                const response = await domenaRef.get();
                const domena = response.data();

                if (domena.kvizi && domena.kvizi.includes(kvizId)) {
                    return { message: 'Kviz je že vključen v to domeno', domena: domena };
                }
                const updatedKvizi = domena.kvizi ? [...domena.kvizi, kvizId] : [kvizId];

                db.collection("Domene_znanja").doc(id).update({kvizi: updatedKvizi});
                return { message: 'Uspešna posodobitev domene', domena: domena };
            } else {
                return { message: 'Neuspešna posodobitev domene', domena: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async dodajGradivo(id, naziv, file) {
        try {
            if (this.getById(id) != undefined) {
                const gradivoRef = ref(storage, `${id}/${naziv}`);
                uploadBytes(gradivoRef, file).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                }).catch((error) => {
                console.error('Error uploading file:', error);
                });
                return { message: 'Uspešno dodano gradivo', gradivo: naziv };
            } else {
                return { message: 'Neuspešno dodano gradivo', gradivo: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async izbrisiGradivo(id, naziv) {
        try {
            if (this.getById(id) != undefined) {
                const gradivoRef = ref(storage, `${id}/${naziv}`);
                deleteObject(gradivoRef).then(() => {
                    console.log('File deleted');
                }).catch((error) => {
                    console.log('Error with file deletion');
                });
                return { message: 'Uspešno izbrisano gradivo', gradivo: naziv };
            } else {
                return { message: 'Neuspešno izbrisano gradivo', gradivo: undefined };
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async izbrisi(id) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();
            if (domena == undefined) {
                throw new Error('Domena ne obstaja');
            }
            await db.collection("Domene_znanja").doc(id).delete();

            return { message: 'Domena izbrisana', domena: domena };
        } catch (error) {
            throw new Error('Napaka pri brisanju domene iz baze: ' + error.message);
        }
    }
}

module.exports = Domena;