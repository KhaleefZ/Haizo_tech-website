const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_for_dev_only';

function generateToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
}

async function run() {
  const user = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
  if (!user) { console.log('No super admin found'); return; }
  
  const token = generateToken({ userId: user.id, role: user.role });
  
  const res = await fetch('http://localhost:5001/api/work-categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ name: 'Test Category ' + Date.now() })
  });
  
  if (!res.ok) {
    console.error('Failed:', await res.text());
  } else {
    console.log('Success:', await res.json());
  }
}

run();
