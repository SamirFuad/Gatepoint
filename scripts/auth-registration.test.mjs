import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  insertRegistration,
  registrationPhone,
} from '../src/features/registrations/lib/registration-insert.ts';
import {
  authProfile,
  profileName,
} from '../src/features/auth/lib/auth-profile.ts';

const require = createRequire(import.meta.url);
const { NextRequest, NextResponse } = require('next/server');
const root = fileURLToPath(new URL('../', import.meta.url));

// Compile repository modules in memory to exercise actual service/Proxy/UI code
// with isolated auth responses, without credentials or live database writes.
function loadModule(relative, mocks = {}, cache = new Map()) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file).exports;
  const loadedModule = { exports: {} };
  cache.set(file, loadedModule);
  const output = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  const localRequire = createRequire(file);
  const load = (name) => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base = name.startsWith('@/')
        ? path.join(root, 'src', name.slice(2))
        : path.resolve(path.dirname(file), name);
      for (const suffix of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) {
        try {
          if (readFileSync(base + suffix)) {
            return loadModule(path.relative(root, base + suffix), mocks, cache);
          }
        } catch (error) {
          if (error.code !== 'ENOENT' && error.code !== 'EISDIR') throw error;
        }
      }
    }
    return localRequire(name);
  };
  new Function('require', 'module', 'exports', output)(
    load,
    loadedModule,
    loadedModule.exports
  );
  return loadedModule.exports;
}

const guest = {
  eventId: 'event',
  organizationId: 'organization',
  formId: 'form',
  email: 'guest@example.test',
  fullName: 'Sample Guest',
  responses: [],
};
test('registration after removing a phone question does not reference the phone column', async () => {
  const payloads = [];
  const result = await insertRegistration(
    async (payload) => {
      payloads.push(payload);
      if (Object.hasOwn(payload, 'phone'))
        return {
          data: null,
          error: {
            code: 'PGRST204',
            message:
              "Could not find the 'phone' column of 'registrations' in the schema cache",
          },
        };
      return { data: { id: 'created' }, error: null };
    },
    guest,
    'GP-SAMPLE'
  );
  assert.equal(result.data.id, 'created');
  assert.equal(payloads.length, 1);
  assert.equal(Object.hasOwn(payloads[0], 'phone'), false);
});
test('legacy schema fallback preserves a supplied phone and never retries a successful insert', async () => {
  const payloads = [];
  const result = await insertRegistration(
    async (payload) => {
      payloads.push(payload);
      return payloads.length === 1
        ? {
            data: null,
            error: {
              code: 'PGRST204',
              message:
                "Could not find the 'phone' column of 'registrations' in the schema cache",
            },
          }
        : { data: { id: 'created', metadata: payload.metadata }, error: null };
    },
    { ...guest, phone: '251911000000' },
    'GP-SAMPLE'
  );
  assert.equal(payloads.length, 2);
  assert.equal(payloads[0].phone, '251911000000');
  assert.equal(Object.hasOwn(payloads[1], 'phone'), false);
  assert.equal(
    payloads[1].confirmation_number,
    payloads[0].confirmation_number
  );
  assert.equal(registrationPhone(result.data), '251911000000');
  let calls = 0;
  await insertRegistration(
    async () => {
      calls++;
      return { data: { id: 'created' }, error: null };
    },
    { ...guest, phone: '251911000000' },
    'GP-SAMPLE'
  );
  assert.equal(calls, 1);
});
test('duplicate, permission, network, and unrelated schema errors are not retried', async () => {
  for (const error of [
    { code: '23505', message: 'Duplicate email' },
    { code: '42501', message: 'Not allowed' },
    {
      code: 'PGRST204',
      message: "Could not find the 'other' column of 'registrations'",
    },
    { code: 'FETCH_ERROR', message: 'Network unavailable' },
  ]) {
    let calls = 0;
    const result = await insertRegistration(
      async () => {
        calls++;
        return { data: null, error };
      },
      { ...guest, phone: '251911000000' },
      'GP-SAMPLE'
    );
    assert.equal(calls, 1);
    assert.equal(result.error, error);
  }
  assert.equal(
    registrationPhone({ phone: 'primary', metadata: { phone: 'fallback' } }),
    'primary'
  );
  assert.equal(registrationPhone({ metadata: {} }), null);
});

test('public submission ignores a removed phone question even when a stale form still submits it', async () => {
  const eventId = 'e0000000-0000-4000-8000-000000000001';
  const organizationId = 'e0000000-0000-4000-8000-000000000002';
  const formId = 'e0000000-0000-4000-8000-000000000003';
  const phoneId = 'e0000000-0000-4000-8000-000000000004';
  const event = {
    id: eventId,
    organizationId,
    slug: 'sample',
    isPublished: true,
    status: 'published',
    endsAt: '2099-01-01T00:00:00Z',
    registrationOpensAt: null,
    registrationClosesAt: null,
  };
  for (const activePhone of [false, true]) {
    let created;
    const { submitPublicRegistrationAction } = loadModule(
      'src/features/registrations/actions.ts',
      {
        'next/navigation': {
          redirect: (url) => {
            throw new Error('REDIRECT:' + url);
          },
        },
        '@/features/events/services/supabase-event-service': {
          createEventService: () => ({
            getBySlug: async () => ({ data: event, error: null }),
            getById: async () => ({ data: event, error: null }),
          }),
        },
        '@/features/registration-forms/services/supabase-registration-form-service':
          {
            createRegistrationFormService: () => ({
              getByEventId: async () => ({
                data: {
                  id: formId,
                  eventId,
                  organizationId,
                  isActive: true,
                  fields: activePhone
                    ? [{ id: phoneId, fieldType: 'phone', isRequired: false }]
                    : [],
                },
                error: null,
              }),
            }),
          },
        './services/supabase-registration-service': {
          createRegistrationService: () => ({
            create: async (data) => {
              created = data;
              return {
                data: { id: 'created', confirmationNumber: 'GP-SAMPLE' },
                error: null,
              };
            },
          }),
        },
        '@/features/qr-codes/services/supabase-qr-code-service': {
          createQRCodeService: () => ({
            generateForRegistration: async () => ({ data: null, error: null }),
          }),
        },
        '@/features/email/services/resend-email-service': {
          createEmailService: () => ({
            sendRegistrationConfirmation: async () => ({
              data: null,
              error: null,
            }),
          }),
        },
      }
    );
    const data = new FormData();
    for (const [name, value] of Object.entries({
      eventId,
      organizationId,
      formId,
      fullName: 'Sample Guest',
      email: 'guest@example.test',
      ['field_' + phoneId]: '+251 911 000 000',
    }))
      data.set(name, value);
    await assert.rejects(
      () => submitPublicRegistrationAction('sample', {}, data),
      /REDIRECT:\/public\/events\/sample\/register\/success/
    );
    assert.equal(created.phone, activePhone ? '251911000000' : undefined);
    assert.equal(created.responses.length, activePhone ? 1 : 0);
  }
});

test('refreshed cookies and private cache headers survive auth redirects and public exploration', async () => {
  const { redirectWithSession } = loadModule(
    'src/lib/supabase/session-response.ts'
  );
  for (const signedIn of [true, false]) {
    const sessionResponse = NextResponse.next();
    sessionResponse.cookies.set('sb-session.0', signedIn ? 'fresh-token' : '', {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: signedIn ? 3600 : 0,
    });
    sessionResponse.headers.set('Cache-Control', 'private, no-store');
    const { proxy } = loadModule('src/proxy.ts', {
      '@/lib/supabase/middleware': {
        updateSession: async () => ({
          supabaseResponse: sessionResponse,
          user: signedIn ? { id: 'user' } : null,
        }),
      },
      '@/lib/supabase/session-response': { redirectWithSession },
    });
    for (const pathname of [
      '/public/events',
      '/public/events/sample',
      '/public/events/sample/register',
    ]) {
      const response = await proxy(
        new NextRequest('https://gatepoint.example' + pathname)
      );
      assert.equal(response, sessionResponse);
      assert.equal(response.status, 200);
    }
    const response = await proxy(
      new NextRequest(
        'https://gatepoint.example' + (signedIn ? '/login' : '/dashboard')
      )
    );
    assert.equal(response.status, 307);
    assert.equal(
      new URL(response.headers.get('location')).pathname,
      signedIn ? '/dashboard' : '/login'
    );
    assert.equal(
      response.cookies.get('sb-session.0').value,
      signedIn ? 'fresh-token' : ''
    );
    assert.equal(response.cookies.get('sb-session.0').httpOnly, true);
    assert.equal(response.cookies.get('sb-session.0').secure, true);
    assert.equal(
      response.cookies.get('sb-session.0').maxAge,
      signedIn ? 3600 : 0
    );
    assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
  }
});
test('session refresh updates both request and response cookies with cache protection', async () => {
  const oldUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
    oldKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-only';
  try {
    const { updateSession } = loadModule('src/lib/supabase/middleware.ts', {
      '@supabase/ssr': {
        createServerClient: (_url, _key, options) => ({
          auth: {
            getUser: async () => {
              options.cookies.setAll(
                [
                  {
                    name: 'sb-session.0',
                    value: 'fresh',
                    options: { path: '/' },
                  },
                ],
                {
                  'Cache-Control': 'private, no-store',
                  Pragma: 'no-cache',
                  Expires: '0',
                }
              );
              options.cookies.setAll(
                [
                  {
                    name: 'sb-session.1',
                    value: 'chunk-two',
                    options: { path: '/' },
                  },
                ],
                {
                  'Cache-Control': 'private, no-store',
                  Pragma: 'no-cache',
                  Expires: '0',
                }
              );
              return { data: { user: { id: 'user' } } };
            },
          },
        }),
      },
    });
    const request = new NextRequest('https://gatepoint.example/public/events');
    const { supabaseResponse } = await updateSession(request);
    assert.equal(request.cookies.get('sb-session.0').value, 'fresh');
    assert.equal(supabaseResponse.cookies.get('sb-session.0').value, 'fresh');
    assert.equal(
      supabaseResponse.cookies.get('sb-session.1').value,
      'chunk-two'
    );
    assert.match(
      supabaseResponse.headers.get('Cache-Control'),
      /private.*no-store/
    );
    assert.equal(supabaseResponse.headers.get('Pragma'), 'no-cache');
  } finally {
    if (oldUrl === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    else process.env.NEXT_PUBLIC_SUPABASE_URL = oldUrl;
    if (oldKey === undefined) delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    else process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = oldKey;
  }
});

test('public navigation shows the signed-in name and routes organizers straight to their workspace', () => {
  const user = authProfile({
    id: 'sample',
    email: 'selam@example.test',
    user_metadata: { full_name: 'Selam Tesfaye' },
  });
  for (const signedIn of [true, false]) {
    const { MarketingHeader } = loadModule(
      'src/components/layout/marketing-header.tsx',
      {
        '@/components/providers/auth-provider': {
          useAuthUser: () => (signedIn ? user : null),
        },
        '@/features/auth/actions': { logoutAction: async () => {} },
      }
    );
    const html = renderToStaticMarkup(React.createElement(MarketingHeader));
    if (signedIn) {
      assert.match(html, /Selam Tesfaye/);
      assert.match(html, /Signed in/);
      assert.match(html, /href="\/events\/new"/);
      assert.doesNotMatch(html, /href="\/login"/);
    } else {
      assert.match(html, /href="\/login"/);
      assert.doesNotMatch(html, /Selam Tesfaye/);
    }
  }
  assert.equal(
    profileName(
      authProfile({ id: 'google', user_metadata: { name: 'Dawit Bekele' } })
    ),
    'Dawit Bekele'
  );
  assert.equal(
    profileName(authProfile({ id: 'email', email: 'hana@example.test' })),
    'hana'
  );
});
