export interface User {
  uid: string;
  email: string;
  name: string;
}

export interface UsersState {
  Users: User[];
  isLoading: boolean;
  error: string | null;
}
