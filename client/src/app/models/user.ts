export interface NewUser {
  email: string
  password: string
}

export interface User {
  id: number,
  email: string,
}

export type Token = string