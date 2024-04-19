export type InstalacionesAPI = {
  instalaciones: Instalacion[];
};

export type Instalacion = {
  id: number;
  nombre: string;
  precioHora: number;
};
