const Kviz = require('../models/kviz');
//const axios = require('axios');

async function dodajKviz(req, res) {
    const { naziv, vprasanja } = req.body;
  
    if (!naziv || !vprasanja) {
      return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }
  
    try {
      const novKviz = await Kviz.dodaj(naziv, vprasanja);
      
      res.status(200).json({ message: 'Uspešno dodan kviz', kviz: novKviz });
    } catch (error) {
      res.status(500).json({ error: 'Napaka pri vstavljanju kviza v bazo', details: error.message });
    }
}

async function avtPreverjanje(req, res) {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query je zahtevan' });
    }

    try {
        const response = await Kviz.dostopDoModela(query);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri dostopanju do modela', details: error.message });
    }
}

async function vsiKvizi(req, res) {
    try {
        const kvizi = await Kviz.vsi();
        res.status(200).json(kvizi);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju kvizov iz baze', details: error.message });
    }
}
  
async function najdiKviz(req, res) {
    const { id } = req.params;
    try {
        const kviz = await Kviz.getById(id);
        console.log(kviz)
        if (!kviz) {
        return res.status(404).json({ error: 'Quiz ne obstaja' });
        }
        res.status(200).json(kviz);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju kviza iz baze', details: error.message });
    }
}

async function najdiKvize(req, res) {
    const { ids } = req.body;
    try {
        const kvizi = await Kviz.getByIds(ids);
        if (!kvizi) {
        return res.status(404).json({ error: 'Kvizi ne obstajajo' });
        }
        res.status(200).json(kvizi);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju kvizov iz baze', details: error.message });
    }
}

async function spremeniKviz(req, res) {
    const { id } = req.params;
    const { naziv } = req.body;

    if (!naziv) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const updatedKviz = await Kviz.spremeni(id, naziv);
        
        res.status(200).json({ message: 'Uspešno posodobljen kviz', kviz: updatedKviz });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju kviza v bazi', details: error.message });
    }
}

async function dodajVprasanjeKviz(req, res) {
    const { id } = req.params;
    const { vprasanjeId } = req.body;

    if (!vprasanjeId ) {
        return res.status(400).json({ error: 'Izbrano mora biti vprašanje' });
    }

    try {
        const updatedKviz = await Kviz.dodajVprasanje(id, vprasanjeId);
        
        res.status(200).json({ message: 'Uspešno posodobljen kviz', kviz: updatedKviz });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju kviza v bazi', details: error.message });
    }
}

async function odstraniVprasanjeKviz(req, res) {
    const { id } = req.params;
    const { vprasanjeId } = req.body;

    if (!vprasanjeId ) {
        return res.status(400).json({ error: 'Izbrano mora biti vprašanje' });
    }

    try {
        const updatedKviz = await Kviz.odstraniVprasanje(id, vprasanjeId);
        
        res.status(200).json({ message: 'Uspešno posodobljen kviz', kviz: updatedKviz });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju kviza v bazi', details: error.message });
    }
}

async function dodajRezultatKviz(req, res) {
    const { id, uporabnikId, vrednost } = req.body;

    if (!uporabnikId || !vrednost ) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const updatedKviz = await Kviz.dodajRezultat(id, uporabnikId, vrednost);
        
        res.status(200).json({ message: 'Uspešno posodobljen kviz', kviz: updatedKviz });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju kviza v bazi', details: error.message });
    }
}

async function najdiRezultatKviz(req, res) {
    const { id, uporabnikId } = req.body;

    if (!uporabnikId ) {
        return res.status(400).json({ error: 'Izbran mora biti uporabnik' });
    }

    try {
        const rezultat = await Kviz.najdiRezultat(id, uporabnikId);
        if (!rezultat) {
            return res.json(null);
        }
        res.status(200).json(rezultat);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju rezultata iz baze', details: error.message });
    }
}

async function spremeniRezultatKviz(req, res) {
    const { id, uporabnikId, novaVrednost } = req.body;

    if (!uporabnikId || !novaVrednost ) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const updatedKviz = await Kviz.spremeniRezultat(id, uporabnikId, novaVrednost);
        
        res.status(200).json({ message: 'Uspešno posodobljen kviz', kviz: updatedKviz });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju kviza v bazi', details: error.message });
    }
}

async function odstraniRezultatKviz(req, res) {
    const { id } = req.params;
    const { uporabnikId } = req.body;

    if (!uporabnikId ) {
        return res.status(400).json({ error: 'Izbran mora biti uporabnik' });
    }

    try {
        const updatedKviz = await Kviz.odstraniRezultat(id, uporabnikId);
        res.status(200).json({ message: 'Uspešno posodobljen kviz', kviz: updatedKviz });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju kviza v bazi', details: error.message });
    }
}

async function izbrisiKviz(req, res) {
    const { id } = req.params;
    try {
        const kviz = await Kviz.izbrisi(id);
        if (!kviz) {
            return res.status(404).json({ error: 'Quiz ne obstaja' });
        }
        res.status(200).json({ message: 'Quiz izbrisan', kviz: kviz });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri brisanju kviza iz baze', details: error.message });
    }
}

async function najdiKviz(req, res) {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send({ error: 'Id is required' });
    }

    try {
        const kviz = await Kviz.getById(id);
        if (!kviz) {
            return res.status(404).json({ error: 'Quiz ne obstaja' });
        }
        res.status(200).json(kviz);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju kviza iz baze', details: error.message });
    }
}

module.exports = {
    dodajKviz,
    vsiKvizi,
    najdiKviz,
    najdiKvize,
    spremeniKviz,
    dodajVprasanjeKviz,
    odstraniVprasanjeKviz,
    dodajRezultatKviz,
    najdiRezultatKviz,
    spremeniRezultatKviz,
    odstraniRezultatKviz,
    izbrisiKviz,
    najdiKviz,
    avtPreverjanje
};