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
