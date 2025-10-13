export interface AuthState {
  uid: string | null;
  email: string | null;
  isLoading: boolean;
  error: string | null;
}

// C'est la structure des données qu'on va stocker pour l'authentification.
