import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db, { generateId } from '../db.ts';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required.' });
    }

    const validRoles = ['Patient', 'Caretaker', 'Doctor/Admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role selected.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = generateId();

    const result = db.prepare(
      'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)'
    ).run(id, name, email, passwordHash, role);

    res.status(201).json({
      id,
      name,
      email,
      role,
      message: 'User registered successfully.'
    });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Email already exists.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.prepare(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?'
    ).get(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash as string);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

router.get('/me', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] as string | undefined;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = db.prepare(
      'SELECT id, name, email, role FROM users WHERE id = ?'
    ).get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error fetching profile.' });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    let user = db.prepare(
      'SELECT id, name, email, role FROM users WHERE email = ?'
    ).get(email);

    if (!user) {
      const id = generateId();
      const defaultRole = 'Patient';
      db.prepare(
        'INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)'
      ).run(id, name || 'Google User', email, 'google-oauth', defaultRole);
      user = { id, name: name || 'Google User', email, role: defaultRole };
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during Google authentication.' });
  }
});

export default router;
