export type InstalacionesAPI = {
  instalaciones: Instalacion[];
};

export interface Instalacion {
  id: number;
  nombre: string;
  precioHora: number;
}

export interface Reserva {
  id: number;
  idUsuario: number;
  idInstalacion: number;
  fechaYHora: string;
  duracion: number;
  importe: number;
}

export interface OwnReserva extends Reserva {
  nombreInstalacion: string;
}

export interface ReservaModal {
  idInstalacion: number;
  nombreInstalacion: string;
  fechaYHora: string;
  precioHora: number;
  duracion: number[];
}

export interface AuthProps {
  setShowLogin: (showLogin: boolean) => void;
  setShowError: (showError: boolean) => void;
}
