export * from './appointment.service';
import { AppointmentService } from './appointment.service';
export * from './auth.service';
import { AuthService } from './auth.service';
export * from './bloodTestResult.service';
import { BloodTestResultService } from './bloodTestResult.service';
export * from './covidTestResult.service';
import { CovidTestResultService } from './covidTestResult.service';
export * from './doctorSpecialty.service';
import { DoctorSpecialtyService } from './doctorSpecialty.service';
export * from './documentData.service';
import { DocumentDataService } from './documentData.service';
export * from './userDetails.service';
import { UserDetailsService } from './userDetails.service';
export * from './weatherForecast.service';
import { WeatherForecastService } from './weatherForecast.service';
export const APIS = [AppointmentService, AuthService, BloodTestResultService, CovidTestResultService, DoctorSpecialtyService, DocumentDataService, UserDetailsService, WeatherForecastService];
