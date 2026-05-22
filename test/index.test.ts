import { describe, expect, it } from '@jest/globals';

describe('Package Exports', () => {
  describe('Main Entry Point', () => {
    it('should export SolidAuth function', async () => {
      const { SolidAuth } = await import('../src/index.js');

      expect(SolidAuth).toBeDefined();
      expect(typeof SolidAuth).toBe('function');
    });

    it('should export standalone getSession function', async () => {
      const { getSession } = await import('../src/index.js');

      expect(getSession).toBeDefined();
      expect(typeof getSession).toBe('function');
    });

    it('should export AuthError', async () => {
      const { AuthError } = await import('../src/index.js');

      expect(AuthError).toBeDefined();
    });

    it('should export CredentialsSignin', async () => {
      const { CredentialsSignin } = await import('../src/index.js');

      expect(CredentialsSignin).toBeDefined();
    });
  });

  describe('SolidAuth() return shape', () => {
    it('should return handlers with GET and POST', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const result = SolidAuth({ providers: [] });

      expect(result).toHaveProperty('handlers');
      expect(typeof result.handlers.GET).toBe('function');
      expect(typeof result.handlers.POST).toBe('function');
    });

    it('should return flat GET and POST (deprecated)', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const result = SolidAuth({ providers: [] });

      expect(typeof result.GET).toBe('function');
      expect(typeof result.POST).toBe('function');
    });

    it('flat GET/POST should be the same reference as handlers.GET/POST', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const result = SolidAuth({ providers: [] });

      expect(result.GET).toBe(result.handlers.GET);
      expect(result.POST).toBe(result.handlers.POST);
    });

    it('should return getSession function', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const result = SolidAuth({ providers: [] });

      expect(typeof result.getSession).toBe('function');
    });

    it('should return auth as deprecated alias for getSession', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const result = SolidAuth({ providers: [] });

      expect(typeof result.auth).toBe('function');
      expect(result.auth).toBe(result.getSession);
    });

    it('should return signIn and signOut functions', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const result = SolidAuth({ providers: [] });

      expect(typeof result.signIn).toBe('function');
      expect(typeof result.signOut).toBe('function');
    });
  });

  describe('signIn URL construction', () => {
    it('should redirect to /api/auth/signin when a provider is given (provider ignored server-side)', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const { signIn } = SolidAuth({ providers: [] });

      const response = await signIn('zitadel');

      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toBe('/api/auth/signin');
    });

    it('should redirect to /api/auth/signin when no provider given', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const { signIn } = SolidAuth({ providers: [] });

      const response = await signIn();

      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toBe('/api/auth/signin');
    });

    it('should append callbackUrl when redirectTo is provided', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const { signIn } = SolidAuth({ providers: [] });

      const response = await signIn('zitadel', { redirectTo: '/dashboard' });
      const location = response.headers.get('location') ?? '';

      expect(response.status).toBe(302);
      expect(location).toContain('/api/auth/signin');
      expect(location).toContain('callbackUrl=');
      expect(location).toContain('%2Fdashboard');
    });

    it('should respect custom basePath', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const { signIn } = SolidAuth({ providers: [], basePath: '/my-auth' });

      const response = await signIn('zitadel');

      expect(response.headers.get('location')).toBe('/my-auth/signin');
    });

    it('should strip trailing slash from basePath', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const { signIn } = SolidAuth({ providers: [], basePath: '/my-auth/' });

      const response = await signIn('zitadel');

      expect(response.headers.get('location')).toBe('/my-auth/signin');
    });
  });

  describe('signOut URL construction', () => {
    it('should redirect to /api/auth/signout', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const { signOut } = SolidAuth({ providers: [] });

      const response = await signOut();

      expect(response.status).toBe(302);
      expect(response.headers.get('location')).toBe('/api/auth/signout');
    });

    it('should append callbackUrl when redirectTo is provided', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const { signOut } = SolidAuth({ providers: [] });

      const response = await signOut({ redirectTo: '/' });
      const location = response.headers.get('location') ?? '';

      expect(response.status).toBe(302);
      expect(location).toContain('/api/auth/signout');
      expect(location).toContain('callbackUrl=');
    });

    it('should respect custom basePath', async () => {
      const { SolidAuth } = await import('../src/index.js');
      const { signOut } = SolidAuth({ providers: [], basePath: '/my-auth' });

      const response = await signOut();

      expect(response.headers.get('location')).toBe('/my-auth/signout');
    });
  });

  describe('Standalone getSession', () => {
    it('should accept two parameters (request + config)', async () => {
      const { getSession } = await import('../src/index.js');

      expect(getSession.length).toBe(2);
    });
  });

  describe('Adapter Entry Point', () => {
    it('should be importable', async () => {
      const module = await import('../src/adapter.js');

      expect(module).toBeDefined();
    });
  });

  describe('Client Entry Point', () => {
    it('should export signIn function', async () => {
      const { signIn } = await import('../src/client.js');

      expect(signIn).toBeDefined();
      expect(typeof signIn).toBe('function');
    });

    it('should export signOut function', async () => {
      const { signOut } = await import('../src/client.js');

      expect(signOut).toBeDefined();
      expect(typeof signOut).toBe('function');
    });
  });
});
