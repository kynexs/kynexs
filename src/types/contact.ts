export type ContactInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
};
export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "UNREPLIED" | "REPLIED";
  createdAt: string;
};

export type ContactStats = {
  total: number;
  today: number;
  replied: number;
};
