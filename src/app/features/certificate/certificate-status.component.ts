import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CertificateService } from '../../core/services/certificate.service';
import { RegistrationService } from '../../core/services/registration.service';
import { RegistrationResponse } from '../../core/models/registration.model';

@Component({
  selector: 'app-certificate-status',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './certificate-status.component.html',
  styleUrls: ['./certificate-status.component.scss']
})
export class CertificateStatusComponent {
  searchForm: FormGroup;
  isSearching = signal<boolean>(false);
  isDownloading = signal<boolean>(false);
  searched = signal<boolean>(false);
  recordFound = signal<RegistrationResponse | null>(null);
  searchError = signal<string | null>(null);
  downloadError = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private certificateService: CertificateService
  ) {
    this.searchForm = this.fb.group({
      query: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const query = this.searchForm.value.query.trim();
    this.isSearching.set(true);
    this.searched.set(false);
    this.searchError.set(null);
    this.recordFound.set(null);

    // Use the dedicated public lookup endpoint
    this.registrationService.lookupByEmailOrMobile(query).subscribe({
      next: (res) => {
        this.isSearching.set(false);
        this.searched.set(true);
        if (res.success && res.data) {
          this.recordFound.set(res.data);
        } else {
          this.searchError.set('No registration found. Please check your email or mobile number.');
        }
      },
      error: (err) => {
        this.isSearching.set(false);
        this.searched.set(true);
        if (err?.status === 404) {
          this.searchError.set('No registration record found for the provided details. Please ensure you registered using the correct email or mobile number.');
        } else {
          this.searchError.set('Unable to check status at this time. Please try again later.');
        }
      }
    });
  }

  downloadCertificate(): void {
    const certId = this.recordFound()?.certificateId;
    if (!certId) {
      this.downloadError.set('Certificate ID not available. Please contact Renaissance University.');
      return;
    }

    this.isDownloading.set(true);
    this.downloadError.set(null);

    this.certificateService.downloadCertificate(certId).subscribe({
      next: (blob: Blob) => {
        this.isDownloading.set(false);
        this.recordFound.update(r => r ? { ...r, certificateDownloaded: true } : null);

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RU-Certificate-${certId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.isDownloading.set(false);
        this.downloadError.set('Certificate download failed. Please contact Renaissance University or try again later.');
      }
    });
  }
}
