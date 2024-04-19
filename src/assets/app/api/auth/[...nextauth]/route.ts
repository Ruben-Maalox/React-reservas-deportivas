import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "tuemail@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login_check`, {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();

        if (data.error) throw data;

        return { id: data.token, token: data.token };
      },
    }),
  ],
});

export { handler as GET, handler as POST };

/* NextAuth espera que el método authorize devuelva un objeto User o null. El objeto User debe tener una propiedad id que es requerida por NextAuth para identificar al usuario */
