export type SlipType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "application/pdf";

export type RegistrationType = "INDIVIDUAL" | "SQUAD";

export type IglDetails = {
  fullName: string;
  whatsapp: string;
  email: string;
  age: string;
  area: string;
};
export type PlayerDetails = {
  fullName: string;
  age: string;
  pubgName: string;
  whatsapp: string;
  area: string;
};
export type TeamDetails = { teamName: string; players: PlayerDetails[] };

export type IndividualDetails = {
  fullName: string;
  email: string;
  whatsapp: string;
  age: string;
  pubgName: string;
  area: string;
};

/** What the form sends as JSON. `receiptKey` comes from /api/upload. Ages stay strings until validated. */
export type RegistrationInput = TeamDetails & {
  igl: IglDetails;
  agreementsAccepted: boolean;
  receiptKey: string;
  referralCode?: string;
};

export type IndividualInput = {
  player: IndividualDetails;
  agreementsAccepted: boolean;
  receiptKey: string;
};

/** Flat map keyed by path, e.g. "igl.email", "teamName", "players.2.pubgName". */
export type FormErrors = Record<string, string>;

export type RegistrationData = {
  /** Taken from the receipt key, so the stored file path and the database row share one id. */
  registrationId: string;
  receiptKey: string;
  receiptFileName: string;
  teamName: string;
  type: RegistrationType;
  fee: number;
  referralCode: string | null;
  igl: {
    fullName: string;
    whatsapp: string;
    email: string;
    age: number;
    area: string;
  };
  players: {
    slot: number;
    isIgl: boolean;
    fullName: string;
    age: number;
    pubgName: string;
    whatsapp: string;
    area: string;
  }[];
};

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
  type: RegistrationType;
  fee: number;
  referralCodeEntered: string | null;
  createdAt: string;
  players: RegistrationPlayer[];
  receipt: RegistrationReceipt | null;
};

export type RegistrationStats = {
  totalRegistrations: number;
  totalPlayers: number;
  squadCount: number;
  individualCount: number;
  withSlip: number;
  withoutSlip: number;
};
