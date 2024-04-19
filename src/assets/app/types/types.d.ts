import 'next-auth';
// He tenido que extender los tipos de Session porque el objeto user solo tenía email, name, image y otros campos que no necesitaba. Le he añadido id y token (id porque era imprescindible)
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      token: string;
    };
  }
}

export type InstalacionesAPI = {
  instalaciones: Instalacion[];
};

export type Instalacion = {
  id: number;
  nombre: string;
  precioHora: number;
};
