import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { RegistrationRequest, RegistrationResponse } from '../models/registration.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private apiService: ApiService) {}

  register(payload: RegistrationRequest): Observable<ApiResponse<RegistrationResponse>> {
    return this.apiService.post<ApiResponse<RegistrationResponse>>('/registrations', payload);
  }

  getRegistrationById(id: string): Observable<ApiResponse<RegistrationResponse>> {
    return this.apiService.get<ApiResponse<RegistrationResponse>>(`/registrations/${id}`);
  }

  lookupByEmailOrMobile(query: string): Observable<ApiResponse<RegistrationResponse>> {
    const params = new HttpParams().set('query', query);
    return this.apiService.get<ApiResponse<RegistrationResponse>>('/registrations/lookup', params);
  }

  getAllRegistrations(): Observable<ApiResponse<RegistrationResponse[]>> {
    return this.apiService.get<ApiResponse<RegistrationResponse[]>>('/registrations');
  }
}
