const Odgovor = require('../models/odgovor');

async function dodajOdgovor(req, res) {
    const { odgovor, tip } = req.body;
  
    if (!odgovor || !tip) {
      return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }
  
    try {
      const novOdgovor = await Odgovor.dodaj(odgovor, tip);
      
      res.status(200).json({ message: 'Uspešno dodan odgovor', odgovor: novOdgovor });
    } catch (error) {
      res.status(500).json({ error: 'Napaka pri vstavljanju odgovora v bazo', details: error.message });
    }
}
  
async function vsiOdgovori(req, res) {
    try {
        const odgovori = await Odgovor.vsi();
        res.status(200).json(odgovori);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju odgovorov iz baze', details: error.message });
    }
}
  
async function najdiOdgovor(req, res) {
    const { id } = req.params;
    try {
        const odgovor = await Odgovor.getById(id);
        console.log(odgovor)
        if (!odgovor) {
        return res.status(404).json({ error: 'Odgovor ne obstaja' });
        }
        res.status(200).json(odgovor);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju odgovora iz baze', details: error.message });
    }
}

async function spremeniOdgovor(req, res) {
    const { id } = req.params;
    const { odgovor, tip } = req.body;

    if (!odgovor || !tip) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const updatedOdgovor = await Odgovor.spremeni(id, odgovor, tip);
        
        res.status(200).json({ message: 'Uspešno posodobljen odgovor', odgovor: updatedOdgovor });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju odgovora v bazi', details: error.message });
    }
}

async function izbrisiOdgovor(req, res) {
    const { id } = req.params;
    try {
        const odgovor = await Odgovor.izbrisi(id);
        if (!odgovor) {
        return res.status(404).json({ error: 'Odgovor ne obstaja' });
        }
        res.status(200).json({ message: 'Odgovor izbrisan', odgovor: odgovor });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri brisanju odgovora iz baze', details: error.message });
    }
}

module.exports = {
    dodajOdgovor,
    vsiOdgovori,
    najdiOdgovor,
    spremeniOdgovor,
    izbrisiOdgovor
};