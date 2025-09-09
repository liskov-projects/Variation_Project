// Cypress support - e2e
// Add common helpers and global configuration

// Example: programmatic sign-in placeholder
Cypress.Commands.add('programmaticSignIn', (options = {}) => {
  // Implement obtaining a session for Clerk (if test helpers are available)
  // e.g., cy.request('/test-utils/sign-in', { email, password })
  // and set cookies/localStorage as needed
});

// Test auth bypass: add x-test-user-id header to all app requests
Cypress.Commands.add('loginAs', (userId = 'e2e-test-user') => {
  Cypress.env('testUserId', userId);
});

Cypress.Commands.overwrite('request', (originalFn, ...args) => {
  const userId = Cypress.env('testUserId');
  if (!userId) return originalFn(...args);

  const normalize = (options) => {
    if (typeof options === 'string') return { url: options };
    return options || {};
  };

  if (args.length === 1) {
    const options = normalize(args[0]);
    options.headers = { ...(options.headers || {}), 'x-test-user-id': userId };
    return originalFn(options);
  }

  if (args.length === 2) {
    const method = args[0];
    const urlOrOptions = normalize(args[1]);
    urlOrOptions.headers = { ...(urlOrOptions.headers || {}), 'x-test-user-id': userId };
    return originalFn(method, urlOrOptions);
  }

  if (args.length === 3) {
    const method = args[0];
    const url = args[1];
    const body = args[2];
    return originalFn(method, url, body, {
      headers: { 'x-test-user-id': userId }
    });
  }

  return originalFn(...args);
});

// Inject header via intercept for frontend XHR/fetch
beforeEach(() => {
  const userId = Cypress.env('testUserId');
  if (userId) {
    cy.intercept({ url: '/api/**' }, (req) => {
      req.headers['x-test-user-id'] = userId;
    });
  }
});

// Ensure failures include console/network logs if needed
Cypress.on('fail', (error) => {
  throw error;
});
