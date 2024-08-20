const Domain = require('../models/domain');
const multer = require('multer');
const { PassThrough } = require('stream');

async function addDomain(req, res) {
    const { name, description, key_skills, owner } = req.body;
  
    if (!name || !description || !key_skills || !owner) {
      return res.status(400).json({ error: 'All fields must be filled' });
    }
  
    try {
      const newDomain = await Domain.add(name, description, key_skills, owner);
      
      res.status(200).json({ message: 'Domain added successfully', domain: newDomain });
    } catch (error) {
      res.status(500).json({ error: 'Error inserting domain into database', details: error.message });
    }
}
  
async function allDomains(req, res) {
    try {
        const domains = await Domain.all();
        res.status(200).json(domains);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving domains from database', details: error.message });
    }
}

async function findDomain(req, res) {
    const id = req.body.id;
    if (!id) {
        return res.status(400).send({ error: 'Id is required' });
    }

    try {
        const domain = await Domain.getById(id);
        if (!domain) {
        return res.status(404).json({ error: 'The domain does not exist' });
        }
        res.status(200).json(domain);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving domain from database', details: error.message });
    }
}

async function findDomainUser(req, res) {
    const { id } = req.body;
    try {
        const domains = await Domain.getByUser(id);
        if (!domains) {
        return res.status(404).json({ error: 'Domains do not exist' });
        }
        res.status(200).json(domains);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving domains from database', details: error.message });
    }
}

async function findDomainOwner(req, res) {
    const { id } = req.body;
    try {
        const domains = await Domain.getByOwner(id);
        if (!domains) {
        return res.status(404).json({ error: 'Domains do not exist' });
        }
        res.status(200).json(domains);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving domains from database', details: error.message });
    }
}

async function changeDomain(req, res) {
    const { id } = req.params;
    const { name, description, key_skills } = req.body;

    if (!name || !description || !key_skills ) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const updatedDomain = await Domain.change(id, name, description, key_skills);
        
        res.status(200).json({ message: 'Domain successfully updated', domain: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function addUserDomain(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId ) {
        return res.status(400).json({ error: 'A user must be selected' });
    }

    try {
        const updatedDomain = await Domain.addUser(id, userId);
        
        res.status(200).json({ message: 'Domain successfully updated', domain: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function findUsersDomain(req, res) {
    const { id } = req.body;
    try {
        const domain = await Domain.findUsers(id);
        if (!domain) {
        return res.status(404).json({ error: 'The domain does not exist' });
        }
        res.status(200).json(domain);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving domain from database', details: error.message });
    }
}

async function deleteUserDomain(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId ) {
        return res.status(400).json({ error: 'A user must be selected' });
    }

    try {
        const updatedDomain = await Domain.deleteUser(id, userId);
        
        res.status(200).json({ message: 'Domain successfully updated', domain: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function addQuizDomain(req, res) {
    const { id, quizId } = req.body;

    if (!quizId ) {
        return res.status(400).json({ error: 'A quiz must be selected' });
    }

    try {
        const updatedDomain = await Domain.addQuiz(id, quizId);
        
        res.status(200).json({ message: 'Domain successfully updated', domain: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function findQuizzesDomain(req, res) {
    const { id } = req.body;
    try {
        const domain = await Domain.findQuizzes(id);
        if (!domain) {
        return res.status(404).json({ error: 'The domain does not exist' });
        }
        res.status(200).json(domain);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving domain from database', details: error.message });
    }
}

async function deleteQuizDomain(req, res) {
    const { id, quizId } = req.body;

    if (!quizId ) {
        return res.status(400).json({ error: 'A quiz must be selected' });
    }

    try {
        const updatedDomain = await Domain.deleteQuiz(id, quizId);
        
        res.status(200).json({ message: 'Domain successfully updated', domena: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function addResultDomain(req, res) {
    const { id, userId, value } = req.body;

    if (!userId || !value ) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const updatedDomain = await Domain.addResult(id, userId, value);
        
        res.status(200).json({ message: 'Domain successfully updated', domain: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function findResultDomain(req, res) {
    const { id, userId } = req.body;

    if (!userId ) {
        return res.status(400).json({ error: 'A user must be selected' });
    }

    try {
        const result = await Domain.findResult(id, userId);
        if (!result) {
            return res.json(null);
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving result from database', details: error.message });
    }
}

async function changeResultDomain(req, res) {
    const { id, userId, newValue } = req.body;

    if (!userId || !newValue ) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const updatedDomain = await Domain.changeResult(id, userId, newValue);
        
        res.status(200).json({ message: 'Domain successfully updated', domain: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function deleteResultDomain(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId ) {
        return res.status(400).json({ error: 'A user must be selected' });
    }

    try {
        const updatedDomain = await Domain.deleteResult(id, userId);
        res.status(200).json({ message: 'Domain successfully updated', domain: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function modelIdDomain(req, res) {
    const { domain } = req.body;

    if (!domain) {
        return res.status(400).json({ error: 'Domain is required' });
    }

    try {
        const response = await Domain.getModelId(domain);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error accessing the model', details: error.message });
    }
}

async function chatBoxDomain(req, res) {
    const { id, query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    try {
        const response = await Domain.chatBox(id, query);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error accessing the model', details: error.message });
    }
}

async function updateModelDomain(req, res) {
    const { id, nameDomain } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Id is required' });
    }

    try {
        const response = await Domain.updateModel(id, nameDomain);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: 'Error accessing the model', details: error.message });
    }
}

async function addLinkDomain(req, res) {
    const { id,name, link } = req.body;

    if (!name || !link ) {
        return res.status(400).json({ error: 'The link must be selected' });
    }

    try {
        const updatedDomain = await Domain.addLink(id, name, link);
        
        res.status(200).json({ message: 'Domain successfully updated', domain: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function findLinksDomain(req, res) {
    const { id } = req.body;
    try {
        const domain = await Domain.findLinks(id);
        if (!domain) {
        return res.status(404).json({ error: 'The domain does not exist' });
        }
        res.status(200).json(domain);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving domain from database', details: error.message });
    }
}

async function deleteLinkDomain(req, res) {
    const { id, name } = req.body;

    if (!name ) {
        return res.status(400).json({ error: 'The link must be selected' });
    }

    try {
        const updatedDomain = await Domain.deleteLink(id, name);
        
        res.status(200).json({ message: 'Domain successfully updated', domena: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function addLearningMaterialDomain(req, res) {
    const { id, name, link } = req.body;
    const file = req.file;

    if (!id || !name || !link || !file ) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    const fileStream = new PassThrough();
    fileStream.end(file.buffer);

    try {
        const updatedDomain = await Domain.addLearningMaterial(id, name, link, file.buffer);
        
        res.status(200).json({ message: 'Domain successfully updated', domain: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function findLearningMaterialsDomain(req, res) {
    const { id } = req.body;
    try {
        const domain = await Domain.findLearningMaterials(id);
        if (!domain) {
        return res.status(404).json({ error: 'The domain does not exist' });
        }
        res.status(200).json(domain);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving domain from database', details: error.message });
    }
}

async function readLearningMaterialDomain(req, res) {
    const { id, name } = req.body;
    
    if (!id || !name ) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const url = await Domain.readLearningMaterial(id, name);
        
        res.status(200).json(url);
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function deleteLearningMaterialDomain(req, res) {
    const { id, name } = req.body;
    
    console.log(name);
    if (!id || !name ) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const updatedDomain = await Domain.deleteLearningMaterial(id, name);
        
        res.status(200).json({ message: 'Domain successfully updated', domain: updatedDomain });
    } catch (error) {
        res.status(500).json({ error: 'Error updating domain in database', details: error.message });
    }
}

async function deleteDomain(req, res) {
    const { id } = req.params;
    try {
        const domain = await Domain.delete(id);
        if (!domain) {
        return res.status(404).json({ error: 'The domain does not exist' });
        }
        res.status(200).json({ message: 'Domain deleted', domain: domain });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting domain from database', details: error.message });
    }
}

module.exports = {
    addDomain,
    allDomains,
    findDomain,
    findDomainUser,
    findDomainOwner,
    changeDomain,
    addUserDomain,
    findUsersDomain,
    deleteUserDomain,
    addQuizDomain,
    findQuizzesDomain,
    deleteQuizDomain,
    addResultDomain,
    findResultDomain,
    changeResultDomain,
    deleteResultDomain,
    chatBoxDomain,
    updateModelDomain,
    addLinkDomain,
    findLinksDomain,
    deleteLinkDomain,
    addLearningMaterialDomain,
    findLearningMaterialsDomain,
    readLearningMaterialDomain,
    deleteLearningMaterialDomain,
    deleteDomain,
    modelIdDomain
};