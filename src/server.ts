import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import * as cheerio from 'cheerio';
import express from 'express';
import helmet from 'helmet';
import * as crypto from "node:crypto";
import {join} from 'node:path';
import {text} from 'node:stream/consumers';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

function isProduction() {
  return isMainModule(import.meta.url) || process.env['pm_id'];
}

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
 * Nonce
 * */

app.use((_req, res, next) => {
  // Asynchronously generate a unique nonce for each request.
  crypto.randomBytes(32, (err, randomBytes) => {
    if (err) {
      // If there was a problem, bail.
      next(err);
    } else {
      // Save the nonce, as a hex string, to `res.locals` for later.
      res.locals['nonce'] = randomBytes.toString('hex');
      next();
    }
  });
});

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          // Include this nonce in the `script-src` directive.
          // @ts-ignore
          (_req, res) => `'nonce-${res.locals['nonce']}'`,
        ],
        connectSrc: [
          "https://firebase.googleapis.com/",
          "https://firebaseinstallations.googleapis.com/v1/",
          "https://*.google-analytics.com",
          "https://firebaseremoteconfig.googleapis.com/",
          "https://firestore.googleapis.com/",
          "https://firebasestorage.googleapis.com",
          "https://content-firebaseappcheck.googleapis.com/",
          "https://www.google.com/recaptcha/enterprise/",
          !isProduction() ? "http://127.0.0.1:8080/" : "",
          !isProduction() ? "http://127.0.0.1:9199/" : ""
        ],
        'script-src-elem': [
          "'self'",
          // Include this nonce in the `script-src` directive.
          // @ts-ignore
          (_req, res) => `'nonce-${res.locals['nonce']}'`,
          "https://www.googletagmanager.com/gtag/",
          "https://www.google.com/recaptcha/",
          "https://www.gstatic.com/recaptcha/"
        ],
        'img-src': [
          "'self'",
          "https://firebasestorage.googleapis.com/",
          !isProduction() ? "http://127.0.0.1:9199" : ""
        ],
        'frame-src': [
          "'self'",
          "https://www.google.com/"
        ],
        'style-src': [
          "'self'",
          // Include this nonce in the `script-src` directive.
          // @ts-ignore
          (_req, res) => `'nonce-${res.locals['nonce']}'`,
        ]
      },
    },
    referrerPolicy: {
      policy: 'strict-origin'
    },
    xContentTypeOptions: false,
    xXssProtection: true,
    xFrameOptions: {
      action: 'deny'
    }
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req, {
      'nonce': res.locals['nonce']
    })
    .then(async (response) => {

      if (!response) {
        return next();
      }

      const bodyText = await text(response.body!);

      const $ = cheerio.load(bodyText);
      const script = $('script:not([src]):not([nonce]):not([type="application/json"])');
      script.attr('nonce', res.locals['nonce']);

      const bodyTextUpdatedWithNonce = $.html();
      const newResponse = new Response(bodyTextUpdatedWithNonce, response);

      return writeResponseToNodeResponse(newResponse, res);
    }).catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isProduction()) {
  const port = process.env['PORT'] || 4200;
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
