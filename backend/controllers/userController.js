const bcrypt = require('bcrypt');
const User = require('../models/user');

async function addUser(req, res) {
    const { full_name, email, password, role, admin } = req.body;
  
    if (!full_name || !email || !password || !role || !admin) {
      return res.status(400).json({ error: 'All fields must be filled' });
    }
  
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      const newUser = await User.add(full_name, email, hashedPassword, role, admin, password);
      
      res.status(200).json({ message: 'Successful registration', user: newUser });
    } catch (error) {
      res.status(500).json({ error: 'Error inserting user into database', details: error.message });
    }
}
  
async function allUsers(req, res) {
    try {
        const users = await User.all();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving users from database', details: error.message });
    }
}

async function findUser(req, res) {
    const id = req.body.id;
    if (!id) {
        return res.status(400).send({ error: 'Email is required' });
    }

    try {
        const user = await User.getById(id);
        if (!user) {
        return res.status(404).json({ error: 'The user does not exist' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving user from database', details: error.message });
    }
}

async function findUsersAdmin(req, res) {
    const { adminEmail } = req.body;
    try {
        const users = await User.getByAdmin(adminEmail);
        if (!users) {
        return res.status(404).json({ error: 'Users do not exist' });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving users from database', details: error.message });
    }
}

async function findUsersBoss(req, res) {
    const { bossEmail, adminEmail } = req.body;
    try {
        const users = await User.getByBoss(bossEmail, adminEmail);
        if (!users) {
        return res.status(404).json({ error: 'Users do not exist' });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving users from database', details: error.message });
    }
}

async function changeUser(req, res) {
    const { id } = req.params;
    const { full_name, email, password, role, admin } = req.body;

    if (!full_name || !email || !password || !role || !admin) {
        return res.status(400).json({ error: 'All fields must be filled' });
    }

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const updatedUser = await User.change(id, full_name, email, hashedPassword, role, admin);
        
        res.status(200).json({ message: 'Successfully updated user', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user in database', details: error.message });
    }
}

async function deleteUser(req, res) {
    const { id } = req.params;
    try {
        const user = await User.delete(id);
        if (!user) {
        return res.status(404).json({ error: 'The user does not exist' });
        }
        res.status(200).json({ message: 'User deleted', user: user });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user from database', details: error.message });
    }
}

module.exports = {
    addUser,
    allUsers,
    findUser,
    findUsersAdmin,
    findUsersBoss,
    changeUser,
    deleteUser
};