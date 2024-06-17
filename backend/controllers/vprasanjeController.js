const Vprasanje = require('../models/vprasanje');

async function dodajVprasanje(req, res) {
    const { vprasanje, tip } = req.body;
  
    if (!vprasanje || !tip) {
      return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }
  
    try {
      const novoVprasanje = await Vprasanje.dodaj(vprasanje, tip);
      
      res.status(200).json({ message: 'Uspešno dodano vprašanje', vprasanje: novoVprasanje });
    } catch (error) {
      res.status(500).json({ error: 'Napaka pri vstavljanju vprašanja v bazo', details: error.message });
    }
}
  
async function vsaVprasanja(req, res) {
    try {
        const vprasanja = await Vprasanje.vsa();
        res.status(200).json(vprasanja);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju vprašanj iz baze', details: error.message });
    }
}
  
async function najdiVprasanje(req, res) {
    const { id } = req.params;
    try {
        const vprasanje = await Vprasanje.getById(id);
        console.log(vprasanje)
        if (!vprasanje) {
        return res.status(404).json({ error: 'Vprašanje ne obstaja' });
        }
        res.status(200).json(vprasanje);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju vprašanja iz baze', details: error.message });
    }
}

async function spremeniVprasanje(req, res) {
    const { id } = req.params;
    const { vprasanje, tip } = req.body;

    if (!vprasanje || !tip) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const updatedVprasanje = await Vprasanje.spremeni(id, vprasanje, tip);
        
        res.status(200).json({ message: 'Uspešno posodobljeno vprašanje', vprasanje: updatedVprasanje });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju vprašanja v bazi', details: error.message });
    }
}

async function dodajOdgovorVprasanje(req, res) {
    const { id } = req.params;
    const { odgovorId } = req.body;

    if (!odgovorId ) {
        return res.status(400).json({ error: 'Izbran mora biti odgovor' });
    }

    try {
        const updatedVprasanje = await Vprasanje.dodajOdgovor(id, odgovorId);
        
        res.status(200).json({ message: 'Uspešno posodobljeno vprašanje', vprasanje: updatedVprasanje });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju vprašanja v bazi', details: error.message });
    }
}

async function odstraniOdgovorVprasanje(req, res) {
    const { id } = req.params;
    const { odgovorId } = req.body;

    if (!odgovorId ) {
        return res.status(400).json({ error: 'Izbrano mora biti vprašanje' });
    }

    try {
        const updatedVprasanje = await Vprasanje.odstraniOdgovor(id, odgovorId);
        
        res.status(200).json({ message: 'Uspešno posodobljeno vprašanje', vprasanje: updatedVprasanje });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju vprašanja v bazi', details: error.message });
    }
}

async function izbrisiVprasanje(req, res) {
    const { id } = req.params;
    try {
        const vprasanje = await Vprasanje.izbrisi(id);
        if (!vprasanje) {
        return res.status(404).json({ error: 'Vprašanje ne obstaja' });
        }
        res.status(200).json({ message: 'Vprašanje izbrisano', vprasanje: vprasanje });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri brisanju vprašanja iz baze', details: error.message });
    }
}

module.exports = {
    dodajVprasanje,
    vsaVprasanja,
    najdiVprasanje,
    spremeniVprasanje,
    dodajOdgovorVprasanje,
    odstraniOdgovorVprasanje,
    izbrisiVprasanje
};