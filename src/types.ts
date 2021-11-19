interface BaseUser {
  email: string;
  name: string;
}

export interface User extends BaseUser {
  id: string;
  token: string;
  verified: boolean;
}

export interface NewUser extends BaseUser {
  password: string;
}

export interface NewPasswordUser {
  email: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export type NewPassword = Omit<NewPasswordUser, 'email'>;

export type LoginUser = Omit<NewUser, 'name'>;

export interface Note {
  id: string;
  content: string;
  important: boolean;
  date: string;
  user: User;
}

export type NewNote = Omit<Note, 'id' | 'date' | 'user'>;

export type ErrorMessage = { title: string | null, content: string | null };
