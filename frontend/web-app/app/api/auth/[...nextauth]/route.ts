import NextAuth, { NextAuthOptions } from 'next-auth';
import DuendeIDS6Provider from 'next-auth/providers/duende-identity-server6';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    // TODO: Put on env variables
    DuendeIDS6Provider({
      id: 'id-server',
      clientSecret: 'secret',
      clientId: 'nextApp',
      issuer: 'http://localhost:5001',
      authorization: { params: { scope: 'openid profile auctionApp' } },
      idToken: true,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };