export interface Signup {
    user_first_name: string;
    user_last_name: string;
    user_email: string;
    user_password: string;
}

export interface Login {
  user_email: string;
  user_password: string;
}

export interface Profile {
  user_first_name: string;
  user_last_name: string;
}
