const http = require('http');
const url = require('url');
const { readUsers, writeUsers, sendJSON } = require('./utils/helpers');
const { v4: uuidv4 } = require('uuid');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const method = req.method;
  const pathParts = parsedUrl.pathname.split('/').filter(Boolean); // remove empty elements

  if (method === 'GET' && parsedUrl.pathname === '/users') {
    const users = await readUsers();
    return sendJSON(res, 200, users);
  }

  if (method === 'POST' && parsedUrl.pathname === '/users') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', async () => {
      try {
        const newUser = JSON.parse(body);
        newUser.id = uuidv4();
        const users = await readUsers();
        users.push(newUser);
        await writeUsers(users);
        sendJSON(res, 201, newUser);
      } catch (err) {
        sendJSON(res, 400, { error: 'Invalid JSON' });
      }
    });
    return;
  }

  if (method === 'DELETE' && pathParts[0] === 'users' && pathParts[1]) {
    const userId = pathParts[1];
    const users = await readUsers();
    const filtered = users.filter(u => u.id !== userId);
    if (users.length === filtered.length) {
      return sendJSON(res, 404, { error: 'User not found' });
    }
    await writeUsers(filtered);
    return sendJSON(res, 200, { message: 'User deleted' });
  }

  sendJSON(res, 404, { error: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
