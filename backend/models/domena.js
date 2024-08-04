const db = require('../pb');
const { storage, ref, uploadBytes, deleteObject, uploadBytesResumable, listAll, getDownloadURL } = require('../firebase');

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

            const novaDomena = {
                naziv: naziv,
                opis: opis,
                kljucna_znanja: kljucna_znanja,
                lastnik: lastnik,
                kvizi: [],
                zaposleni: [],
                rezultati: [],
                gradiva: []
            };

            db.collection("Domene_znanja").doc(id).set(novaDomena);
            return { message: 'Uspešno dodana domena', domena: novaDomena };
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
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();

            if (domena.zaposleni && domena.zaposleni.includes(uporabnikId)) {
                return { message: 'Uporabnik je že vključen v to domeno', domena: domena };
            }
            const updatedZaposleni = domena.zaposleni ? [...domena.zaposleni, uporabnikId] : [uporabnikId];

            if (domena.rezultati && domena.rezultati.includes(`${uporabnikId};0`)) {
                return { message: 'Uporabnik je že vključen v to domeno', domena: domena };
            }
            const updatedRezultati = domena.rezultati ? [...domena.rezultati, `${uporabnikId};0`] : [`${uporabnikId};0`];

            db.collection("Domene_znanja").doc(id).update({zaposleni: updatedZaposleni, rezultati: updatedRezultati});
            return { message: 'Uspešna posodobitev domene', domena: domena };
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async najdiUporabnike(id) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();
            const users = domena.zaposleni;

            return users;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju uporabnikov iz baze: ' + error.message);
        }
    }

    static async odstraniUporabnika(id, uporabnikId) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();

            if (domena.zaposleni && domena.zaposleni.includes(uporabnikId)) {
                const updatedZaposleni = domena.zaposleni.filter(zaposleniId => zaposleniId !== uporabnikId);

                await db.collection("Domene_znanja").doc(id).update({ zaposleni: updatedZaposleni });
                return { message: 'Uporabnik uspešno odstranjen iz domene', domena: domena };
            } else {
                return { message: 'Uporabnik ni del te domene', domena: domena };
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async dodajKviz(id, kvizId) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();

            if (domena.kvizi && domena.kvizi.includes(kvizId)) {
                return { message: 'Quiz je že vključen v to domeno', domena: domena };
            }
            const updatedKvizi = domena.kvizi ? [...domena.kvizi, kvizId] : [kvizId];

            db.collection("Domene_znanja").doc(id).update({kvizi: updatedKvizi});
            return { message: 'Uspešna posodobitev domene', domena: domena };
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async najdiKvize(id) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();
            const kvizi = domena.kvizi;

            return kvizi;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju kvizov iz baze: ' + error.message);
        }
    }

    static async odstraniKviz(id, kvizId) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();

            if (domena.kvizi && domena.kvizi.includes(kvizId)) {
                const updatedKvizi = domena.kvizi.filter(obstojeciKvizId => obstojeciKvizId !== kvizId);

                await db.collection("Domene_znanja").doc(id).update({ kvizi: updatedKvizi });
                return { message: 'Quiz uspešno odstranjen iz domene', domena: domena };
            } else {
                return { message: 'Quiz ni del te domene', domena: domena };
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async dodajRezultat(id, uporabnikId, vrednost) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();

            const rezultat = `${uporabnikId};${vrednost}`;

            let updatedRezultati = [];

            if (domena.rezultati) {
                const index = domena.rezultati.findIndex(r => {
                    const [uporabnik] = r.split(';');
                    return uporabnik === `${uporabnikId}`;
                });

                if (index !== -1) {
                    domena.rezultati[index] = rezultat;
                    updatedRezultati = [...domena.rezultati];
                } else {
                    updatedRezultati = [...domena.rezultati, rezultat];
                }
            } else {
                updatedRezultati = [rezultat];
            }

            db.collection("Domene_znanja").doc(id).update({rezultati: updatedRezultati});
            return { message: 'Uspešna posodobitev domene', domena: domena };
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async najdiRezultat(id, uporabnikId) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();

            if (domena.rezultati && domena.rezultati.some(r => {
                const [uporabnik] = r.split(';');
                return uporabnik === `${uporabnikId}`;
            })) {
                const rezultat = domena.rezultati.find(r => {
                    const [uporabnik] = r.split(';');
                    return uporabnik === `${uporabnikId}`;
                });
                const rezultatValue = rezultat.split(';')[1];

                return rezultatValue;
            } else {
                return null;
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async spremeniRezultat(id, uporabnikId, novaVrednost) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();

            if (!domena.rezultati) {
                return { message: 'Rezultati niso na voljo za to domeno', domena: domena };
            }

            const index = domena.rezultati.findIndex(r => {
                const [uporabnik] = r.split(';');
                return uporabnik === `${uporabnikId}`;
            });

            if (index !== -1) {
                domena.rezultati[index] = `${uporabnikId};${novaVrednost}`;
                await db.collection("Domene_znanja").doc(id).update({ rezultati: domena.rezultati });
                return { message: 'Rezultat uspešno posodobljen', domena: domena };
            } else {
                return { message: 'Rezultat za tega uporabnika ne obstaja', domena: domena };
            }
        } catch (error) {
            throw new Error('Napaka pri posodabljanju rezultata: ' + error.message);
        }
    }

    static async odstraniRezultat(id, uporabnikId) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();

            if (domena.rezultati && domena.rezultati.some(r => {
                const [uporabnik] = r.split(';');
                return uporabnik === `${uporabnikId}`;
            })) {
                const updatedRezultati = kviz.rezultati.filter(r => {
                    const [uporabnik] = r.split(';');
                    return uporabnik !== `${uporabnikId}`;
                });

                await db.collection("Domene_znanja").doc(id).update({ rezultati: updatedRezultati });
                return { message: 'Rezultat uspešno odstranjen iz domene', domena: domena };
            } else {
                return { message: 'Rezultat ni del te domene', domena: domena };
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async dodajGradivo(id, naziv, fileBuffer) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();

            if (domena.gradiva && domena.gradiva.includes(naziv)) {
                return { message: 'Gradivo je že del te domene', domena: domena };
            }
        
            const updatedGradiva = [...(domena.gradiva || []), naziv];
            await domenaRef.update({ gradiva: updatedGradiva });
            
            const storageRef = ref(storage, `${id}/${naziv}`);
            
            const metadata = {
                contentType: 'application/octet-stream'
            };
            
            const uploadTask = uploadBytesResumable(storageRef, fileBuffer, metadata);
            
            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                }, 
                (error) => {
                    throw new Error('Upload failed: ' + error.message);
                }, 
                () => {
                    return { message: 'Upload successful!', gradivo: naziv };
                }
            );
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    }

    static async najdiGradiva(id) {
        try {
            const domenaRef = db.collection("Domene_znanja").doc(id);
            const response = await domenaRef.get();
            const domena = response.data();
            const gradiva = domena.gradiva;

            return gradiva;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju gradiv iz baze: ' + error.message);
        }
    }

    static async beriGradivo(id, naziv) {
        try {
            const gradivoRef = ref(storage, `${id}/${naziv}`);
            const url = await getDownloadURL(gradivoRef);
    
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob();
            return blob;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju domene iz baze: ' + error.message);
        }
    }

    static async izbrisiGradivo(id, naziv) {
        const domenaRef = db.collection("Domene_znanja").doc(id);
        const response = await domenaRef.get();
        const domena = response.data();

        if (!domena.gradiva || !domena.gradiva.includes(naziv)) {
            return { message: 'Gradivo ni del te domene', domena: domena };
        }

        const updatedGradiva = domena.gradiva.filter(item => item !== naziv);
        await domenaRef.update({ gradiva: updatedGradiva });

        try {
            const gradivoRef = ref(storage, `${id}/${naziv}`);
            deleteObject(gradivoRef).then(() => {
                console.log('File deleted');
            }).catch((error) => {
                console.log('Error with file deletion');
            });
            return { message: 'Uspešno izbrisano gradivo', gradivo: naziv };
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
                throw new Error('Domain ne obstaja');
            }
            await db.collection("Domene_znanja").doc(id).delete();

            return { message: 'Domain izbrisana', domena: domena };
        } catch (error) {
            throw new Error('Napaka pri brisanju domene iz baze: ' + error.message);
        }
    }
}

module.exports = Domena;