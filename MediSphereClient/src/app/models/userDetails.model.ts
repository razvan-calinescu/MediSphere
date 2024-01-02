import { User } from "./user.model";

export interface UserDetails extends User {
    phone: string;
    address: string;
    gender: string;
    birthdate: string;
    bloodType: string;
  }