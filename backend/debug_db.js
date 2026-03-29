import pool from './src/config/db.js';

async function test() {
  try {
    const res = await pool.query('SELECT current_database(), current_user');
    console.log('Connected to DB:', res.rows[0]);
    
    const tableCheck = await pool.query("SELECT * FROM information_schema.columns WHERE table_name = 'users'");
    console.log('Users table columns:', tableCheck.rows.map(r => r.column_name));
    
    process.exit(0);
  } catch (err) {
    console.error('DB Error:', err);
    process.exit(1);
  }
}

test();
