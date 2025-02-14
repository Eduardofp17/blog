export type SignTokenReturn = {
  access_token: string;
  user: UserCreated;
};

export type UserPayloadStrategy = {
  sub: string;
  email: string;
};

export type UserCreated = {
  _id: string;
  username: string;
  email: string;
  name: string;
  lastname: string;
  email_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};
