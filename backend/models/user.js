const db = require('../db');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

class User {
    static async add(full_name, email, password, role, admin, original_password) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const id = email;
            const newUser = {
                full_name: full_name,
                email: email,
                password: hashedPassword,
                role: role,
                admin: admin
            };

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            });
        
            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: 'Login to SkillsBooster',
                text: `Hello,\n\n${admin} has added you to the SkillsBooster app as a ${role}.\nYour password is: ${original_password}\nYou can change it at ${process.env.ACCESS_CORS}/reset.\n\nYour SkillsBooster team`
            };
        
            await transporter.sendMail(mailOptions);

            db.collection("Users").doc(id).set(newUser);
            return { message: 'Successful registration', user: newUser };
        } catch (error) {
            throw new Error('Error inserting user into database: ' + error.message);
        }
    }

    static async all() {
        try {
            const usersRef = db.collection("Users");
            const response = await usersRef.get();
            const users = [];
            response.forEach(doc => {
                users.push(doc.data());
            });

            return users;
        } catch (error) {
            throw new Error('Error retrieving users from database: ' + error.message);
        }
    }

    static async getById(id) {
        try {
            const userRef = db.collection("Users").doc(id);
            const response = await userRef.get();
            const user = response.data();

            return user;
        } catch (error) {
            throw new Error('Error retrieving user from database: ' + error.message);
        }
    }

    static async getByAdmin(adminEmail) {
        try {
            const usersRef = db.collection("Users");
            const response = await usersRef.get();
            const users = [];
            response.forEach(doc => {
                const data = doc.data();
                const admin = data.admin;
                const email = data.email;
                if (email && admin && admin === adminEmail && email != adminEmail) {
                    users.push(data);
            }
            });

            return users;
        } catch (error) {
            throw new Error('Error retrieving user from database: ' + error.message);
        }
    }

    static async getByBoss(bossEmail, adminEmail) {
        try {
            const usersRef = db.collection("Users");
            const response = await usersRef.get();
            const users = [];
            response.forEach(doc => {
                const data = doc.data();
                const admin = data.admin;
                const email = data.email;
                if (email && admin && admin === adminEmail && email != adminEmail && email != bossEmail) {
                    users.push(data);
            }
            });

            return users;
        } catch (error) {
            throw new Error('Error retrieving users from database: ' + error.message);
        }
    }

    static async change(id, full_name, email, password, role, admin) {
        try {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = {
                full_name: full_name,
                email: email,
                password: hashedPassword,
                role: role,
                admin: admin
            };

            db.collection("Users").doc(id).update(user);
            return { message: 'Successful user update', user: user };
        } catch (error) {
            throw new Error('Error updating user in database: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const userRef = db.collection("Users").doc(id);
            const response = await userRef.get();
            const user = response.data();
            if (user == undefined) {
                throw new Error('The user does not exist');
            }
            await db.collection("Users").doc(id).delete();

            return { message: 'User deleted', user: user };
        } catch (error) {
            throw new Error('Error deleting user from database: ' + error.message);
        }
    }
}

module.exports = User;