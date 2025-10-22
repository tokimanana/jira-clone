export interface User {
  uid: string;
  email: string;
  name: string;
}

export interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}
