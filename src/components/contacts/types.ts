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
