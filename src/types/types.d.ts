export type InstalacionesAPI = {
  instalaciones: Instalacion[];
};

export type Instalacion = {
  id: number;
  nombre: string;
  precioHora: number;
};

export type Reserva = {
  ID: string;
  idUsuario: string;
  idInstalacion: string;
  fecha: string;
  hora: string;
  duracion: string;
  importe: string;
};