const db = require('../pb');
const axios = require('axios');

class Kviz {
    static async dodaj(naziv, vprasanja) {
        try {
            const id = naziv.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

            const novKviz = {
                naziv: naziv,
                rezultati: [],
                vprasanja: vprasanja
            };

            db.collection("Kvizi").doc(id).set(novKviz);
            return { message: 'Uspešno dodan kviz', kviz: novKviz };
        } catch (error) {
            throw new Error('Napaka pri vstavljanju kviza v bazo: ' + error.message);
        }
    }

    static async vsi() {
        try {
            const kviziRef = db.collection("Kvizi");
            const response = await kviziRef.get();
            const kvizi = [];
            response.forEach(doc => {
                kvizi.push(doc.data());
            });

            return kvizi;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju kvizov iz baze: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            const kviziRef = db.collection("Kvizi").doc(id);
            const response = await kviziRef.get();
            const kviz = response.data();

            return kviz;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju kviza iz baze: ' + error.message);
        }
    }

    static async getByIds(ids) {
        try {
            const kviziRef = db.collection("Kvizi");
            const kviziPromises = ids.map(id => kviziRef.doc(id).get());
            const responses = await Promise.all(kviziPromises);
            const kvizi = responses.map(response => response.data());

            return kvizi;
        } catch (error) {
            throw new Error('Napaka pri pridobivanju kvizov iz baze: ' + error.message);
        }
    }

    static async spremeni(id, naziv) {
        try {
            const kviz = {
                naziv: naziv
            };

            db.collection("Kvizi").doc(id).update(kviz);
            return { message: 'Uspešna posodobitev kviza', kviz: kviz };
        } catch (error) {
            throw new Error('Napaka pri posodabljanju kviza v bazi: ' + error.message);
        }
    }

    static async dodajVprasanje(id, vprasanjeId) {
        try {
            const kvizRef = db.collection("Kvizi").doc(id);
            const response = await kvizRef.get();
            const kviz = response.data();

            if (kviz.vprasanja && kviz.vprasanja.includes(vprasanjeId)) {
                return { message: 'Vprašanje je že vključeno v ta kviz', kviz: kviz };
            }
            const updatedVprasanja = kviz.vprasanja ? [...kviz.vprasanja, vprasanjeId] : [vprasanjeId];

            db.collection("Kvizi").doc(id).update({vprasanja: updatedVprasanja});
            return { message: 'Uspešna posodobitev kviza', kviz: kviz };
        } catch (error) {
            throw new Error('Napaka pri pridobivanju kviza iz baze: ' + error.message);
        }
    }

    static async odstraniVprasanje(id, vprasanjeId) {
        try {
            const kvizRef = db.collection("Kvizi").doc(id);
            const response = await kvizRef.get();
            const kviz = response.data();

            if (kviz.vprasanja && kviz.vprasanja.includes(vprasanjeId)) {
                const updatedVprasanja = kviz.vprasanja.filter(obstojeceVprasanjeId => obstojeceVprasanjeId !== vprasanjeId);

                await db.collection("Kvizi").doc(id).update({ vprasanja: updatedVprasanja });
                return { message: 'Vprašanje uspešno odstranjeno iz kviza', kviz: kviz };
            } else {
                return { message: 'Vprašanje ni del tega kviza', kviz: kviz };
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju kviza iz baze: ' + error.message);
        }
    }

    static async dodajRezultat(id, uporabnikId, vrednost) {
        try {
            const kvizRef = db.collection("Kvizi").doc(id);
            const response = await kvizRef.get();
            const kviz = response.data();

            const rezultat = `${uporabnikId};${vrednost}`;

            let updatedRezultati = [];

            if (kviz.rezultati) {
                const index = kviz.rezultati.findIndex(r => {
                    const [uporabnik] = r.split(';');
                    return uporabnik === `${uporabnikId}`;
                });

                if (index !== -1) {
                    kviz.rezultati[index] = rezultat;
                    updatedRezultati = [...kviz.rezultati];
                } else {
                    updatedRezultati = [...kviz.rezultati, rezultat];
                }
            } else {
                updatedRezultati = [rezultat];
            }

            db.collection("Kvizi").doc(id).update({rezultati: updatedRezultati});
            return { message: 'Uspešna posodobitev kviza', kviz: kviz };
        } catch (error) {
            throw new Error('Napaka pri pridobivanju kviza iz baze: ' + error.message);
        }
    }

    static async najdiRezultat(id, uporabnikId) {
        try {
            const kvizRef = db.collection("Kvizi").doc(id);
            const response = await kvizRef.get();
            const kviz = response.data();

            if (kviz.rezultati && kviz.rezultati.some(r => {
                const [uporabnik] = r.split(';');
                return uporabnik === `${uporabnikId}`;
            })) {
                const rezultat = kviz.rezultati.find(r => {
                    const [uporabnik] = r.split(';');
                    return uporabnik === `${uporabnikId}`;
                });
                const rezultatValue = rezultat.split(';')[1];

                return rezultatValue;
            } else {
                return null;
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju kviza iz baze: ' + error.message);
        }
    }

    static async spremeniRezultat(id, uporabnikId, novaVrednost) {
        try {
            const kvizRef = db.collection("Kvizi").doc(id);
            const response = await kvizRef.get();
            const kviz = response.data();

            if (!kviz.rezultati) {
                return { message: 'Rezultati niso na voljo za ta kviz', kviz: kviz };
            }

            const index = kviz.rezultati.findIndex(r => {
                const [uporabnik] = r.split(';');
                return uporabnik === `${uporabnikId}`;
            });

            if (index !== -1) {
                kviz.rezultati[index] = `${uporabnikId};${novaVrednost}`;
                await db.collection("Kvizi").doc(id).update({ rezultati: kviz.rezultati });
                return { message: 'Rezultat uspešno posodobljen', kviz: kviz };
            } else {
                return { message: 'Rezultat za tega uporabnika ne obstaja', kviz: kviz };
            }
        } catch (error) {
            throw new Error('Napaka pri posodabljanju rezultata: ' + error.message);
        }
    }

    static async odstraniRezultat(id, uporabnikId) {
        try {
            const kvizRef = db.collection("Kvizi").doc(id);
            const response = await kvizRef.get();
            const kviz = response.data();

            if (kviz.rezultati && kviz.rezultati.some(r => {
                const [uporabnik] = r.split(';');
                return uporabnik === `${uporabnikId}`;
            })) {
                const updatedRezultati = kviz.rezultati.filter(r => {
                    const [uporabnik] = r.split(';');
                    return uporabnik !== `${uporabnikId}`;
                });

                await db.collection("Kvizi").doc(id).update({ rezultati: updatedRezultati });
                return { message: 'Rezultat uspešno odstranjen iz kviza', kviz: kviz };
            } else {
                return { message: 'Rezultat ni del tega kviza', kviz: kviz };
            }
        } catch (error) {
            throw new Error('Napaka pri pridobivanju kviza iz baze: ' + error.message);
        }
    }

    static async preveriOdgovor(id, query, answer) {
        try {
           
            const kvizRef = db.collection("Kvizi").doc(id);
            const response = await kvizRef.get();
            const kviz = response.data();
    
            if (!kviz) {
                throw new Error('Kviz ne obstaja');
            }
    
          
            const vprasanje = kviz.vprasanja.find(vprasanje => vprasanje.id === query || vprasanje.vprasanje === query);
    
            if (!vprasanje) {
                throw new Error('Vprašanje ne obstaja v tem kvizu');
            }
    
            const rightAnswer = vprasanje.pravilenOdgovor || ''; 
    
          
            const prompt = `Given the expected response: '${rightAnswer}', and the generated response: '${answer}' to the question '${vprasanje.vprasanje}', does the generated response accurately capture the key information? Yes or No.`;
    
            
            const responseGPT = await fetch('https://api.openai.com/v1/chat/completionss', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` 
                },
                body: JSON.stringify({
                    prompt: prompt,
                    max_tokens: 150,
                    temperature: 0, 
                    top_p: 1,
                    n: 1,
                    stop: ["\n"]
                })
            });
    
            
            const data = await responseGPT.json();
            const evaluationResult = data.choices[0].text.trim();
    
            
            return evaluationResult.toLowerCase().includes('yes');
        } catch (error) {
            throw new Error('Error evaluating response: ' + error.message);
        }
    }
    

    static async izbrisi(id) {
        try {
            const kvizRef = db.collection("Kvizi").doc(id);
            const response = await kvizRef.get();
            const kviz = response.data();
            if (kviz == undefined) {
                throw new Error('Quiz ne obstaja');
            }
            await db.collection("Kvizi").doc(id).delete();

            return { message: 'Quiz izbrisan', kviz: kviz };
        } catch (error) {
            throw new Error('Napaka pri brisanju kviza iz baze: ' + error.message);
        }
    }
}

module.exports = Kviz;