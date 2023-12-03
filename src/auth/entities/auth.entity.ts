enum Role {
  USER,
  ADMIN,
}
export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  isEmailVerified: boolean;
  isVerified: boolean;
  isDeleted: boolean;
  hashedRefreshToken: string;
  activationLink: string;
}
