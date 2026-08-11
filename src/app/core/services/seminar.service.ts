import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, PageResponse } from '../models/api-response.model';
import { Seminar } from '../models/seminar.model';

@Injectable({
  providedIn: 'root'
})
export class SeminarService {

  constructor(private apiService: ApiService) {}

  getAllSeminars(): Observable<ApiResponse<PageResponse<Seminar>>> {
    return this.apiService.get<ApiResponse<PageResponse<Seminar>>>('/seminars');
  }

  getActiveSeminar(): Observable<ApiResponse<Seminar>> {
    return this.apiService.get<ApiResponse<Seminar>>('/seminars/active');
  }

  getSeminarById(id: string): Observable<ApiResponse<Seminar>> {
    return this.apiService.get<ApiResponse<Seminar>>(`/seminars/${id}`);
  }

  getSeminarBySlug(slug: string): Observable<ApiResponse<Seminar>> {
    return this.apiService.get<ApiResponse<Seminar>>(`/seminars/slug/${slug}`);
  }
}
