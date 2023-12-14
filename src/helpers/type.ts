export type Payout = {
  dateAndTime: string;
  status: string;
  value: string;
  username: string;
};

export type Metadata = {
  page: number;
  limit: number;
  totalCount: number;
};
