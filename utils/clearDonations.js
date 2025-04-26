const Database = require('@replit/database');
const db = new Database();

async function clearDonations() {
    await db.delete('donations');
    await db.delete('pending_donations');
    console.log('✅ Donations and pending donations cleared.');
}

clearDonations();
