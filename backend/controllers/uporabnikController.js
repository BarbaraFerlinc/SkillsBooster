const bcrypt = require('bcrypt');
const Uporabnik = require('../models/uporabnik');

async function dodajUporabnika(req, res) {
    const { ime_priimek, email, geslo, vloga, admin } = req.body;
  
    if (!ime_priimek || !email || !geslo || !vloga || !admin) {
      return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }
  
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(geslo, saltRounds);
  
      const newUser = await Uporabnik.dodaj(ime_priimek, email, hashedPassword, vloga, admin, geslo);
      
      res.status(200).json({ message: 'Uspešna registracija', user: newUser });
    } catch (error) {
      res.status(500).json({ error: 'Napaka pri vstavljanju uporabnika v bazo', details: error.message });
    }
}
  
async function vsiUporabniki(req, res) {
    try {
        const users = await Uporabnik.vsi();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju uporabnikov iz baze', details: error.message });
    }
}
  
async function najdiUporabnika(req, res) {
    const { id } = req.params;
    try {
        const user = await Uporabnik.getById(id);
        if (!user) {
        return res.status(404).json({ error: 'Uporabnik ne obstaja' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju uporabnika iz baze', details: error.message });
    }
}

async function najdiUporabnikaAdmin(req, res) {
    const { adminEmail } = req.body;
    try {
        const uporabniki = await Uporabnik.getByAdmin(adminEmail);
        if (!uporabniki) {
        return res.status(404).json({ error: 'Uporabniki ne obstajajo' });
        }
        res.status(200).json(uporabniki);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju uporabnikov iz baze', details: error.message });
    }
}

async function najdiUporabnikaBoss(req, res) {
    const { bossEmail, adminEmail } = req.body;
    try {
        const uporabniki = await Uporabnik.getByBoss(bossEmail, adminEmail);
        if (!uporabniki) {
        return res.status(404).json({ error: 'Uporabniki ne obstajajo' });
        }
        res.status(200).json(uporabniki);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju uporabnikov iz baze', details: error.message });
    }
}

async function spremeniUporabnika(req, res) {
    const { id } = req.params;
    const { ime_priimek, email, geslo, vloga, admin } = req.body;

    if (!ime_priimek || !email || !geslo || !vloga || !admin) {
        return res.status(400).json({ error: 'Vsa polja morajo biti izpolnjena' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(geslo, saltRounds);

        const updatedUser = await Uporabnik.spremeni(id, ime_priimek, email, hashedPassword, vloga, admin);
        
        res.status(200).json({ message: 'Uspešno posodobljen uporabnik', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri posodabljanju uporabnika v bazi', details: error.message });
    }
}

async function izbrisiUporabnika(req, res) {
    const { id } = req.params;
    try {
        const user = await Uporabnik.izbrisi(id);
        if (!user) {
        return res.status(404).json({ error: 'Uporabnik ne obstaja' });
        }
        res.status(200).json({ message: 'Uporabnik izbrisan', user: user });
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri brisanju uporabnika iz baze', details: error.message });
    }
}

async function profilUporabnika(req, res) {
    const id = req.body.id;
    if (!id) {
        return res.status(400).send({ error: 'Email is required' });
    }

    try {
        const user = await Uporabnik.getById(id);
        if (!user) {
        return res.status(404).json({ error: 'Uporabnik ne obstaja' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Napaka pri pridobivanju uporabnika iz baze', details: error.message });
    }
}

module.exports = {
    dodajUporabnika,
    vsiUporabniki,
    najdiUporabnika,
    najdiUporabnikaAdmin,
    najdiUporabnikaBoss,
    spremeniUporabnika,
    izbrisiUporabnika,
    profilUporabnika
};