import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CertificateService } from '../../core/services/certificate.service';
import { RegistrationResponse } from '../../core/models/registration.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.scss']
})
export class RegistrationSuccessComponent implements OnInit {
  registration = signal<RegistrationResponse | null>(null);
  isDownloading = signal<boolean>(false);
  downloadError = signal<string | null>(null);

  constructor(
    private router: Router,
    private certificateService: CertificateService
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['registration']) {
      this.registration.set(nav.extras.state['registration']);
    }
  }

  ngOnInit(): void {
    if (!this.registration()) {
      this.router.navigate(['/student-form']);
    }
  }

  downloadCertificate(): void {
    const certId = this.registration()?.certificateId;
    if (!certId) {
      this.downloadError.set('Certificate ID not found. Please try again or check your email.');
      return;
    }

    this.isDownloading.set(true);
    this.downloadError.set(null);

    this.certificateService.downloadCertificate(certId).subscribe({
      next: (blob: Blob) => {
        this.isDownloading.set(false);

        // Trigger browser download
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
        this.downloadError.set(
          'Download failed. The certificate may still be processing — please check your email or try again in a moment.'
        );
      }
    });
  }
}
