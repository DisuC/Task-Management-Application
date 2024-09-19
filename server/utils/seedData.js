require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/database');

const seedUsers = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin1234',
        role: 'admin',
    },
    {
        name: 'Manager User',
        email: 'manager@example.com',
        password: 'manager1234',
        role: 'manager',
    },
    {
        name: 'Employee User',
        email: 'employee@example.com',
        password: 'employee1234',
        role: 'employee',
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();
        await User.deleteMany({});

        for (const userData of seedUsers) {
            const user = new User(userData);
            await user.save();
        }

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};


module.exports = seedDatabase;
