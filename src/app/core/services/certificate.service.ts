import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { CertificateVerification } from '../models/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private apiService: ApiService) {}

  downloadCertificate(certificateId: string): Observable<Blob> {
    return this.apiService.getBlob(`/certificates/download/${certificateId}`);
  }

  verifyCertificate(certificateId: string): Observable<ApiResponse<CertificateVerification>> {
    return this.apiService.get<ApiResponse<CertificateVerification>>(`/certificates/verify/${certificateId}`);
  }
}
