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

export interface MyProfile {
  user_age: number | null;
  user_city: string | null;
  user_country: string | null;
  user_email: string | null;
  user_first_name: string | null;
  user_gender: string | null;
  user_id: number | null;
  user_isdeleted: number | null;
  user_last_name: string | null;
  user_password: string | null;
  user_role_id: number | null;
  user_state: string | null;
}