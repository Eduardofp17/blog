export type SignTokenReturn = {
  access_token: string;
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
  createdAt: Date;
  updatedAt: Date;
};
