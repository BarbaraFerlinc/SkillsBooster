const Domena = require('../models/domena');

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
        return res.status(404).json({ error: 'Domena ne obstaja' });
        }
        res.status(200).json(domena);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju domene iz baze', details: error.message });
    }
}

async function najdiDomenoUser(req, res) {
    const { id } = req.params;
    try {
        const domene = await Domena.getByUser(id);
        if (!domene) {
        return res.status(404).json({ error: 'Domene ne obstajajo' });
        }
        res.status(200).json(domene);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju domen iz baze', details: error.message });
    }
}

async function najdiDomenoOwner(req, res) {
    const { id } = req.params;
    try {
        const domene = await Domena.getByOwner(id);
        if (!domene) {
        return res.status(404).json({ error: 'Domene ne obstajajo' });
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

// v kvizController.js??
async function dodajKvizDomena(req, res) {
    const { id } = req.params;
    const { kvizId } = req.body;

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

async function dodajGradivoDomena(req, res) {
    const { id } = req.params;
    const { naziv, file } = req.body;

    if (!naziv || !file ) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const updatedDomena = await Domena.dodajGradivo(id, naziv, file);
        
        res.status(200).json({ message: 'Uspešno posodobljena domena', domena: updatedDomena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju domene v bazi', details: error.message });
    }
}

async function izbrisiGradivoDomena(req, res) {
    const { id } = req.params;
    const { naziv } = req.body;
    
    if (!naziv ) {
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
        return res.status(404).json({ error: 'Domena ne obstaja' });
        }
        res.status(200).json({ message: 'Domena izbrisana', domena: domena });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri brisanju domene iz baze', details: error.message });
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
    dodajKvizDomena,
    dodajGradivoDomena,
    izbrisiGradivoDomena,
    izbrisiDomeno
};