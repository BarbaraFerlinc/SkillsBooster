const Company = require('../models/company');

async function addCompany(req, res) {
    const { name, address, postal_code, admin_email } = req.body;
  
    if (!name || !address || !postal_code || !admin_email) {
      return res.status(400).json({ error: 'All fields must be filled' });
    }
  
    try {
      const newCompany = await Company.add(name, address, postal_code, admin_email);
      
      res.status(200).json({ message: 'Company successfully added', company: newCompany });
    } catch (error) {
      res.status(500).json({ error: 'Error inserting the company into the database', details: error.message });
    }
}

async function allCompanies(req, res) {
    try {
        const company = await Company.all();
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving companies from database', details: error.message });
    }
}

async function findCompany(req, res) {
    const { id } = req.params;
    try {
        const company = await Company.getById(id);
        if (!company) {
        return res.status(404).json({ error: 'The company does not exist' });
        }
        res.status(200).json(company);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving company from database', details: error.message });
    }
}

async function changeCompany(req, res) {
    const { id } = req.params;
    const { name, address, postal_code, admin_email } = req.body;

    if (!name || !address || !postal_code || !admin_email) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const updatedCompany = await Company.change(id, name, address, postal_code, admin_email);
        
        res.status(200).json({ message: 'Successfully modernized company', company: updatedCompany });
    } catch (error) {
        res.status(500).json({ error: 'Error updating the company in the database', details: error.message });
    }
}

async function deleteCompany(req, res) {
    const { id } = req.params;
    try {
        const company = await Company.delete(id);
        if (!company) {
        return res.status(404).json({ error: 'The company does not exist' });
        }
        res.status(200).json({ message: 'Company deleted', company: company });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting company from database', details: error.message });
    }
}

module.exports = {
    addCompany,
    allCompanies,
    findCompany,
    changeCompany,
    deleteCompany
};