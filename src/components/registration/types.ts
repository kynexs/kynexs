export type RegistrationPlayer = {
  id: string;
  slot: number;
  isIgl: boolean;
  fullName: string;
  age: number;
  pubgName: string;
  whatsapp: string;
  area: string;
};

export type RegistrationReceipt = {
  id: string;
  fileKey: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
};

export type RegistrationRow = {
  id: string;
  teamName: string;
  contactName: string;
  contactWhatsapp: string;
  contactEmail: string;
  contactAge: number;
  contactArea: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  players: RegistrationPlayer[];
  receipt: RegistrationReceipt | null;
};

export type RegistrationStats = {
  totalRegistrations: number;
  withSlip: number;
  totalPlayers: number;
  withoutSlip: number;
};
