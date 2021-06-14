interface BaseUser {
  username: string;
  name: string;
}

export interface User extends BaseUser {
  id: string;
  token: string;
}

export interface NewUser extends BaseUser {
  password: string;
}

export type LoginUser = Omit<NewUser, 'name'>
