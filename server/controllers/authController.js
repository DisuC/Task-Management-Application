const User = require('../models/user');
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
};

exports.register = async (req, res) => {
    try {
        const {name,email,password,role} = req.body;
        const userExist = await User.findOne({email});
        if (userExist) {
            return res.status(400).send({error: 'User already exists'});
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        if(user){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }else {
            res.status(400).send({error: 'Invalid user data'});
        }
    }catch (error){
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('Login request body:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ message: 'Please provide an email and password' });
        }

        // Check for user email
        const user = await User.findOne({ email }).select('+password');
        console.log('User found:', user ? 'Yes' : 'No');

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            console.log('Invalid credentials');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

