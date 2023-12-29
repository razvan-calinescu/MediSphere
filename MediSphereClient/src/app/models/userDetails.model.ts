import { User } from "./user.model";

export interface UserDetails extends User {
    phone: string;
    address: string;
    gender: string;
    birthDate: string;
    bloodType: string;
  }