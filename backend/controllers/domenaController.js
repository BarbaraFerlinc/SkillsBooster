const Domena = require('../models/domena');
const multer = require('multer');
const { PassThrough } = require('stream');

async function dodajDomeno(req, res) {
    const { naziv, opis, kljucna_znanja, lastnik } = req.body;
  
    if (!naziv || !opis || !kljucna_znanja || !lastnik) {
      return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }
  
    try {
      const novaDomena = await Domena.dodaj(naziv, opis, kljucna_znanja, lastnik);
      
      res.status(200).json({ message: 'Uspešno dodana domena', domena: novaDomena });
    } catch (error) {
      res.status(500).json({ error: 'Napaka pri vstavljanju domene v bazo', details: error.message });
    }
}
  
async function vseDomene(req, res) {
    try {
        const domene = await Domena.vse();
        res.status(200).json(domene);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju domen iz baze', details: error.message });
    }
}
  
async function najdiDomenoId(req, res) {
    const { id } = req.params;
    try {
        const domena = await Domena.getById(id);
        if (!domena) {
        return res.status(404).json({ error: 'Domain ne obstaja' });
        }
        res.status(200).json(domena);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju domene iz baze', details: error.message });
    }
}

async function najdiDomenoUser(req, res) {
    const { id } = req.body;
    try {
        const domene = await Domena.getByUser(id);
        if (!domene) {
        return res.status(404).json({ error: 'Domain ne obstajajo' });
        }
        res.status(200).json(domene);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju domen iz baze', details: error.message });
    }
}

async function najdiDomenoOwner(req, res) {
    const { id } = req.body;
    try {
        const domene = await Domena.getByOwner(id);
        if (!domene) {
        return res.status(404).json({ error: 'Domain ne obstajajo' });
        }
        res.status(200).json(domene);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju domen iz baze', details: error.message });
    }
}

async function spremeniDomeno(req, res) {
    const { id } = req.params;
    const { naziv, opis, kljucna_znanja } = req.body;

    if (!naziv || !opis || !kljucna_znanja ) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const updatedDomena = await Domena.spremeni(id, naziv, opis, kljucna_znanja);
        
        res.status(200).json({ message: 'Uspešno posodobljena domena', domena: updatedDomena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function dodajUporabnikaDomena(req, res) {
    const { id } = req.params;
    const { uporabnikId } = req.body;

    if (!uporabnikId ) {
        return res.status(400).json({ error: 'Izbran mora biti uporabnik' });
    }

    try {
        const updatedDomena = await Domena.dodajUporabnika(id, uporabnikId);
        
        res.status(200).json({ message: 'Uspešno posodobljena domena', domena: updatedDomena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function najdiUporabnikeDomena(req, res) {
    const { id } = req.body;
    try {
        const domena = await Domena.najdiUporabnike(id);
        if (!domena) {
        return res.status(404).json({ error: 'Domena ne obstaja' });
        }
        res.status(200).json(domena);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju domene iz baze', details: error.message });
    }
}

async function odstraniUporabnikaDomena(req, res) {
    const { id } = req.params;
    const { uporabnikId } = req.body;

    if (!uporabnikId ) {
        return res.status(400).json({ error: 'Izbran mora biti uporabnik' });
    }

    try {
        const updatedDomena = await Domena.odstraniUporabnika(id, uporabnikId);
        
        res.status(200).json({ message: 'Uspešno posodobljena domena', domena: updatedDomena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function dodajKvizDomena(req, res) {
    const { id, kvizId } = req.body;

    if (!kvizId ) {
        return res.status(400).json({ error: 'Izbran mora biti kviz' });
    }

    try {
        const updatedDomena = await Domena.dodajKviz(id, kvizId);
        
        res.status(200).json({ message: 'Uspešno posodobljena domena', domena: updatedDomena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function najdiKvizeDomena(req, res) {
    const { id } = req.body;
    try {
        const domena = await Domena.najdiKvize(id);
        if (!domena) {
        return res.status(404).json({ error: 'Domain ne obstaja' });
        }
        res.status(200).json(domena);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju domene iz baze', details: error.message });
    }
}

async function odstraniKvizDomena(req, res) {
    const { id, kvizId } = req.body;

    if (!kvizId ) {
        return res.status(400).json({ error: 'Izbran mora biti kviz' });
    }

    try {
        const updatedDomena = await Domena.odstraniKviz(id, kvizId);
        
        res.status(200).json({ message: 'Uspešno posodobljena domena', domena: updatedDomena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function dodajRezultatDomena(req, res) {
    const { id, uporabnikId, vrednost } = req.body;

    if (!uporabnikId || !vrednost ) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const updatedDomena = await Domena.dodajRezultat(id, uporabnikId, vrednost);
        
        res.status(200).json({ message: 'Uspešno posodobljena domena', domena: updatedDomena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function najdiRezultatDomena(req, res) {
    const { id, uporabnikId } = req.body;

    if (!uporabnikId ) {
        return res.status(400).json({ error: 'Izbran mora biti uporabnik' });
    }

    try {
        const rezultat = await Domena.najdiRezultat(id, uporabnikId);
        if (!rezultat) {
            return res.json(null);
        }
        res.status(200).json(rezultat);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju rezultata iz baze', details: error.message });
    }
}

async function spremeniRezultatDomena(req, res) {
    const { id, uporabnikId, novaVrednost } = req.body;

    if (!uporabnikId || !novaVrednost ) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const updatedDomena = await Domena.spremeniRezultat(id, uporabnikId, novaVrednost);
        
        res.status(200).json({ message: 'Uspešno posodobljena domena', domena: updatedDomena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function odstraniRezultatDomena(req, res) {
    const { id } = req.params;
    const { uporabnikId } = req.body;

    if (!uporabnikId ) {
        return res.status(400).json({ error: 'Izbran mora biti uporabnik' });
    }

    try {
        const updatedDomena = await Domena.odstraniRezultat(id, uporabnikId);
        res.status(200).json({ message: 'Uspešno posodobljena domena', domena: updatedDomena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function dodajGradivoDomena(req, res) {
    const { id, naziv } = req.body;
    const file = req.file;
    console.log(file);

    if (!id || !naziv || !file ) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    const fileStream = new PassThrough();
    fileStream.end(file.buffer);

    try {
        const updatedDomena = await Domena.dodajGradivo(id, naziv, file.buffer);
        
        res.status(200).json({ message: 'Uspešno posodobljena domena', domena: updatedDomena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function najdiGradivadomena(req, res) {
    const { id } = req.body;
    try {
        const domena = await Domena.najdiGradiva(id);
        if (!domena) {
        return res.status(404).json({ error: 'Domain ne obstaja' });
        }
        res.status(200).json(domena);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju domene iz baze', details: error.message });
    }
}

async function beriGradivoDomena(req, res) {
    const { id, naziv } = req.body;
    
    if (!id || !naziv ) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const url = await Domena.beriGradivo(id, naziv);
        
        res.status(200).json(url);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function izbrisiGradivoDomena(req, res) {
    const { id, naziv } = req.body;
    
    if (!id || !naziv ) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const updatedDomena = await Domena.izbrisiGradivo(id, naziv);
        
        res.status(200).json({ message: 'Uspešno posodobljena domena', domena: updatedDomena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function izbrisiDomeno(req, res) {
    const { id } = req.params;
    try {
        const domena = await Domena.izbrisi(id);
        if (!domena) {
        return res.status(404).json({ error: 'Domain ne obstaja' });
        }
        res.status(200).json({ message: 'Domain izbrisana', domena: domena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri brisanju domene iz baze', details: error.message });
    }
}

async function najdiDomeno(req, res) {
    const id = req.body.id;
    if (!id) {
        return res.status(400).send({ error: 'Id is required' });
    }

    try {
        const domena = await Domena.getById(id);
        if (!domena) {
        return res.status(404).json({ error: 'Domain ne obstaja' });
        }
        res.status(200).json(domena);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju domene iz baze', details: error.message });
    }
}

module.exports = {
    dodajDomeno,
    vseDomene,
    najdiDomenoId,
    najdiDomenoUser,
    najdiDomenoOwner,
    spremeniDomeno,
    dodajUporabnikaDomena,
    najdiUporabnikeDomena,
    odstraniUporabnikaDomena,
    dodajKvizDomena,
    najdiKvizeDomena,
    odstraniKvizDomena,
    dodajRezultatDomena,
    najdiRezultatDomena,
    spremeniRezultatDomena,
    odstraniRezultatDomena,
    dodajGradivoDomena,
    najdiGradivadomena,
    beriGradivoDomena,
    izbrisiGradivoDomena,
    izbrisiDomeno,
    najdiDomeno
};