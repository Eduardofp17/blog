export type UserPayload = {
  sub: string;
};

export type User = {
  _id: string;
  profilePic: string;
  username: string;
  email: string;
  name: string;
  lastname: string;
  email_verified: boolean;
  createdAt: string;
  updatedAt: string;
};


export type UserCookie = {
  _id: string;
  username: string;
  email: string;
  name: string;
  lastname: string;
  email_verified: boolean;
};