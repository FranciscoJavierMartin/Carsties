import { serverAuth$ } from '@builder.io/qwik-auth';
import DuendeIdentityServer6Provider from '@auth/core/providers/duende-identity-server6';
import type { Provider } from '@auth/core/providers';

export const { onRequest, useAuthSession, useAuthSignin, useAuthSignout } =
  serverAuth$(({ env }) => ({
    secret: env.get('AUTH_SECRET'),
    trustHost: true,
    session: { strategy: 'jwt' },
    providers: [
      DuendeIdentityServer6Provider({
        id: env.get('AUTH_DIS6_ID'),
        clientId: env.get('AUTH_DIS6_CLIENT_ID')!,
        clientSecret: env.get('AUTH_DIS6_CLIENT_SECRET')!,
        issuer: env.get('AUTH_DIS6_ISSUER'),
        authorization: { params: { scope: 'openid profile auctionApp' } },
      }),
    ] as Provider[],
    callbacks: {
      async jwt({ token }) {
        return token;
      },
      async session({ session }) {
        return session;
      },
    },
  }));
