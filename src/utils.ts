import { User } from './types';

const isString = (text: unknown): text is string => typeof text === 'string' || text instanceof String;

const parseString = (name: string, str: unknown): string => {
  if (!str || !isString(str)) {
    throw new TypeError(`Incorrect or missing ${name}: ${str}`);
  } else {
    return str;
  }
};

type Fields = { id: unknown, username: unknown, name: unknown, token: unknown };

const toUser = ({
  id, username, name, token,
}: Fields): User => {
  const user: User = {
    id: parseString('id', id),
    username: parseString('username', username),
    name: parseString('name', name),
    token: parseString('token', token),
  };

  return user;
};

export default { toUser };