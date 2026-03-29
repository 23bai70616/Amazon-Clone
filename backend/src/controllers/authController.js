import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'amazon_super_secret', { expiresIn: '7d' });
};

export const register = async (req, res, next) => {
  try {
    const { name, identifier, password } = req.body;

    if (!name || !identifier || !password) {
      return res.status(400).json({ message: 'Enter your name, email/mobile and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Determine if identifier is email or phone
    const isEmail = identifier.includes('@');
    const normalizedIdentifier = isEmail ? identifier.toLowerCase() : identifier;
    const email = isEmail ? normalizedIdentifier : null;
    const mobile = !isEmail ? identifier : null;

    // Check if user already exists
    const query = isEmail 
      ? 'SELECT id FROM users WHERE email = $1' 
      : 'SELECT id FROM users WHERE mobile = $1';
    
    const existing = await pool.query(query, [normalizedIdentifier]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ 
        message: isEmail ? 'Email address already in use' : 'Mobile number already in use' 
      });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = await pool.query(
      `INSERT INTO users (name, email, mobile, password) VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, mobile`,
      [name, email, mobile, hashedPassword]
    );

    const user = newUser.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({ 
      user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile }, 
      token 
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Enter your email/mobile and password' });
    }

    // Determine if identifier is email or phone
    const isEmail = identifier.includes('@');
    
    const query = isEmail 
      ? 'SELECT * FROM users WHERE email = $1' 
      : 'SELECT * FROM users WHERE mobile = $1';

    const result = await pool.query(query, [isEmail ? identifier.toLowerCase() : identifier]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "We cannot find an account with that email/mobile number" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'The password you entered is incorrect' });
    }

    const token = generateToken(user.id);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const requestOTP = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ message: 'Identifier is required' });

    // Generate 6 digit code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in DB
    await pool.query(
      'INSERT INTO otps (identifier, code, expires_at) VALUES ($1, $2, $3)',
      [identifier, otp, expiresAt]
    );

    // In a real app, send via SNS/Twilio/Nodemailer here
    console.log(`[REAL AUTH] OTP for ${identifier}: ${otp}`);

    res.json({ message: 'OTP sent successfully', otp }); // Returning OTP for testing convenience
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (req, res, next) => {
  try {
    const { identifier, code } = req.body;
    if (!identifier || !code) return res.status(400).json({ message: 'Code is required' });

    const result = await pool.query(
      'SELECT * FROM otps WHERE identifier = $1 AND code = $2 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1',
      [identifier, code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP is valid - Find user
    const isEmail = identifier.includes('@');
    const userQuery = isEmail 
      ? 'SELECT * FROM users WHERE email = $1' 
      : 'SELECT * FROM users WHERE mobile = $1';
    
    const userResult = await pool.query(userQuery, [isEmail ? identifier.toLowerCase() : identifier]);
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'User not found. Please register first.' });
    }

    const user = userResult.rows[0];
    const token = generateToken(user.id);

    // Delete OTP after use
    await pool.query('DELETE FROM otps WHERE identifier = $1', [identifier]);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile },
      token
    });
  } catch (error) {
    next(error);
  }
};
