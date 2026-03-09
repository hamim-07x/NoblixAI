import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

// --- API Routes for Telegram Mini App ---

// Simulated Database
const usersDb = new Map<number, any>();

// Sync User Endpoint
app.post('/api/user/sync', (req, res) => {
  const { user } = req.body;
  if (!user || !user.id) {
    res.status(400).json({ error: 'Invalid user data' });
    return;
  }

  let existingUser = usersDb.get(user.id);
  if (!existingUser) {
    // New user registration
    existingUser = {
      ...user,
      balance: 0,
      joinedAt: new Date().toISOString()
    };
    usersDb.set(user.id, existingUser);
    console.log(`New user registered: ${user.id}`);
  } else {
    // Update existing user info (like profile pic)
    existingUser = { ...existingUser, ...user };
    usersDb.set(user.id, existingUser);
  }

  res.json({ success: true, balance: existingUser.balance, user: existingUser });
});

// Add Balance Endpoint (for Earn/Airdrop)
app.post('/api/user/add-balance', (req, res) => {
  const { userId, amount } = req.body;
  if (!userId || typeof amount !== 'number') {
    res.status(400).json({ error: 'Invalid request' });
    return;
  }

  const user = usersDb.get(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  user.balance += amount;
  usersDb.set(userId, user);
  
  res.json({ success: true, balance: user.balance });
});

// --- End API Routes ---

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
