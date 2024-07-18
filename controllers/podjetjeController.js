const Podjetje = require('../models/podjetje');

async function dodajPodjetje(req, res) {
    const { naziv, naslov, postna_stevilka, admin_email } = req.body;
  
    if (!naziv || !naslov || !postna_stevilka || !admin_email) {
      return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }
  
    try {
      const novoPodjetje = await Podjetje.dodaj(naziv, naslov, postna_stevilka, admin_email);
      
      res.status(200).json({ message: 'Uspešno dodano podjetje', podjetje: novoPodjetje });
    } catch (error) {
      res.status(500).json({ error: 'Napaka pri vstavljanju podjetja v bazo', details: error.message });
    }
}

async function vsaPodjetja(req, res) {
    try {
        const podjetja = await Podjetje.vsa();
        res.status(200).json(podjetja);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju podjetij iz baze', details: error.message });
    }
}

async function najdiPodjetje(req, res) {
    const { id } = req.params;
    try {
        const podjetje = await Podjetje.getById(id);
        console.log(podjetje)
        if (!podjetje) {
        return res.status(404).json({ error: 'Podjetje ne obstaja' });
        }
        res.status(200).json(podjetje);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju podjetja iz baze', details: error.message });
    }
}

async function izbrisiPodjetje(req, res) {
    const { id } = req.params;
    try {
        const podjetje = await Podjetje.izbrisi(id);
        if (!podjetje) {
        return res.status(404).json({ error: 'Podjetje ne obstaja' });
        }
        res.status(200).json({ message: 'Podjetje izbrisan', podjetje: podjetje });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri brisanju podjetja iz baze', details: error.message });
    }
}

async function spremeniPodjetje(req, res) {
    const { id } = req.params;
    const { naziv, naslov, postna_stevilka, admin_email } = req.body;

    if (!naziv || !naslov || !postna_stevilka || !admin_email) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const spremenjenoPodjetje = await Podjetje.spremeni(id, naziv, naslov, postna_stevilka, admin_email);
        
        res.status(200).json({ message: 'Uspešno posodobljeno podjetje', podjetje: spremenjenoPodjetje });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju podjetja v bazi', details: error.message });
    }
}

module.exports = {
    dodajPodjetje,
    vsaPodjetja,
    najdiPodjetje,
    izbrisiPodjetje,
    spremeniPodjetje
};