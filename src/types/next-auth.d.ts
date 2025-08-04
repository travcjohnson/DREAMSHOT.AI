declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role: string;
    };
  }

  interface User {
    role: string;
  }

  interface JWT {
    role: string;
  }
}