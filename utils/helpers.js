const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, '../data/users.json');

async function readUsers() {
  const data = await fs.readFile(dataFile, 'utf-8');
  return JSON.parse(data);
}

async function writeUsers(users) {
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

module.exports = {
  readUsers,
  writeUsers,
  sendJSON,
};
