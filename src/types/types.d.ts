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
  duraciones: number[];
  isEdit: boolean;
  reservationId?: number | null;
}

export interface AuthProps {
  setShowLogin: (showLogin: boolean) => void;
  setError: (showError: string) => void;
}

export interface UserEditProps {
  name: string;
  surname: string;
  phone: string;
  picture: string | null;
}

export interface UserInfoProps extends UserEditProps {
  email: string;
  id: number;
  token: string;
  fromGoogle: boolean;
  isAdmin: boolean;
}

export interface MergeRows {
  [key: number]: {
    merge: number;
    first: boolean;
  };
}

export interface EditReservationInfo {
  installationId: number;
  date: Date;
  reservationId: number;
}

export interface ReservationsTableProps {
  handleRefetch: () => void;
  reservations: Reserva[];
  installations: Instalacion[];
  error: string | null;
  setError: (error: string) => void;
  date: Date;
  handleShowEditReservation?: () => void;
  editInfo?: EditReservationInfo | null;
}
