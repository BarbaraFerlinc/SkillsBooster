const db = require('../db');

class Company {
    static async add(name, address, postal_code, admin_email) {
        try {
            const id = name.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const newCompany = {
                name: name,
                address: address,
                postal_code: postal_code,
                admin: admin_email
            };

            db.collection("Companies").doc(id).set(newCompany);
            return { message: 'Company successfully added', company: newCompany };
        } catch (error) {
            throw new Error('Error inserting the company into the database: ' + error.message);
        }
    }

    static async all() {
        try {
            const companiesRef = db.collection("Companies");
            const response = await companiesRef.get();
            const companies = [];
            response.forEach(doc => {
                companies.push(doc.data());
            });

            return companies;
        } catch (error) {
            throw new Error('Error retrieving companies from database: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const companyRef = db.collection("Companies").doc(id);
            const response = await companyRef.get();
            const company = response.data();
            if (company == undefined) {
                throw new Error('The company does not exist');
            }
            await db.collection("Companies").doc(id).delete();

            return { message: 'Company deleted', company: company };
        } catch (error) {
            throw new Error('Error deleting company from database: ' + error.message);
        }
    }
}

module.exports = Company;