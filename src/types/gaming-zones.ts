export type GamingZoneRow = {
  id: string;
  zoneName: string;
  zoneNumber: string;
  zoneLocation: string;
  referralCode: string;
  registrationCount: number;
  createdAt: string;
};

export type GamingZoneStats = {
  referredRegistrations: number;
  topZone: {
    zoneName: string;
    referralCode: string;
    count: number;
  } | null;
};
