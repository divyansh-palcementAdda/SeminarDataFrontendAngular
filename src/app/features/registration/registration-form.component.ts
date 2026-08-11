import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { RegistrationService } from '../../core/services/registration.service';
import { SeminarService } from '../../core/services/seminar.service';
import { BoardType, CourseType, RegistrationRequest } from '../../core/models/registration.model';
import { Seminar } from '../../core/models/seminar.model';

// India states → cities map
const INDIA_STATE_CITIES: Record<string, string[]> = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Kakinada', 'Rajahmundry', 'Other'],
  'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur', 'Other'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Bongaigaon', 'Other'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Arrah', 'Other'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Other'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Other'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Anand', 'Other'],
  'Haryana': ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Other'],
  'Himachal Pradesh': ['Shimla', 'Mandi', 'Solan', 'Dharamshala', 'Kullu', 'Manali', 'Other'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Other'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Ballari', 'Other'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Other'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Rewa', 'Satna', 'Chhindwara', 'Ratlam', 'Dewas', 'Shivpuri', 'Morena', 'Burhanpur', 'Khandwa', 'Other'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad', 'Solapur', 'Amravati', 'Kolhapur', 'Thane', 'Nanded', 'Other'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Other'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongpoh', 'Other'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Other'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Other'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Other'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Other'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Other'],
  'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Other'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Other'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Mahbubnagar', 'Other'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Other'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly', 'Aligarh', 'Ghaziabad', 'Moradabad', 'Other'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Other'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Other'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Pitampura', 'Lajpat Nagar', 'Saket', 'Noida Extension', 'Other'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Other'],
  'Ladakh': ['Leh', 'Kargil', 'Other'],
  'Chandigarh': ['Chandigarh', 'Other'],
  'Puducherry': ['Puducherry', 'Karaikal', 'Yanam', 'Mahe', 'Other'],
  'Other': ['Other']
};

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DatePipe],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
  registrationForm!: FormGroup;
  isSubmitting = signal<boolean>(false);
  submitted = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  seminarLoadError = signal<string | null>(null);
  isSeminarLoading = signal<boolean>(true);
  activeSeminar = signal<Seminar | null>(null);
  sameAsMobile = signal<boolean>(false);

  // All states
  readonly states = Object.keys(INDIA_STATE_CITIES).sort();

  // Cities for currently selected state
  cities: string[] = [];

  boards: { value: BoardType; label: string }[] = [
    { value: 'CBSE', label: 'CBSE — Central Board of Secondary Education' },
    { value: 'ICSE', label: 'ICSE — Indian Certificate of Secondary Education' },
    { value: 'MP_BOARD', label: 'MP Board — Madhya Pradesh State Board' },
    { value: 'UP_BOARD', label: 'UP Board — Uttar Pradesh State Board' },
    { value: 'RBSE', label: 'RBSE — Rajasthan Board of Secondary Education' },
    { value: 'OTHER', label: 'Other State / National Board' }
  ];

  courses: { value: CourseType; label: string }[] = [
    { value: 'PCM', label: 'PCM — Physics, Chemistry, Mathematics' },
    { value: 'PCB', label: 'PCB — Physics, Chemistry, Biology' },
    { value: 'COMMERCE', label: 'Commerce Stream' },
    { value: 'ARTS', label: 'Arts & Humanities Stream' },
    { value: 'AGRICULTURE', label: 'Agriculture Stream' },
    { value: 'OTHER', label: 'Other Specialization' }
  ];

  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService,
    private seminarService: SeminarService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchActiveSeminar();
  }

  initForm(): void {
    this.registrationForm = this.fb.group({
      seminarId: ['', [Validators.required]],
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      whatsappNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      schoolName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      board: ['', [Validators.required]],
      course: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]]
    });

    // When state changes, reset city and load new city list
    this.registrationForm.get('state')!.valueChanges.subscribe(state => {
      this.registrationForm.patchValue({ city: '' }, { emitEvent: false });
      this.cities = state ? (INDIA_STATE_CITIES[state] ?? ['Other']) : [];
    });

    // Keep WhatsApp in sync with mobile when "same as mobile" is checked
    this.registrationForm.get('mobileNumber')!.valueChanges.subscribe(mobile => {
      if (this.sameAsMobile()) {
        this.registrationForm.get('whatsappNumber')!.setValue(mobile, { emitEvent: false });
      }
    });
  }

  fetchActiveSeminar(): void {
    const seminarIdParam = this.route.snapshot.queryParams['seminarId'];
    this.isSeminarLoading.set(true);
    this.seminarLoadError.set(null);

    if (seminarIdParam) {
      this.seminarService.getSeminarById(seminarIdParam).subscribe({
        next: (res) => {
          this.isSeminarLoading.set(false);
          if (res.data) {
            this.activeSeminar.set(res.data);
            this.registrationForm.patchValue({ seminarId: res.data.id });
            if (!res.data.registrationEnabled || !res.data.isActive) {
              this.seminarLoadError.set(`Registrations for "${res.data.title}" are currently closed. Please contact Renaissance University.`);
            }
          } else {
            this.seminarLoadError.set('The seminar linked in this QR code could not be found. Please contact Renaissance University.');
          }
        },
        error: () => {
          this.isSeminarLoading.set(false);
          this.seminarLoadError.set('Unable to load seminar details. Please check your internet connection and try again.');
        }
      });
    } else {
      this.seminarService.getActiveSeminar().subscribe({
        next: (res) => {
          this.isSeminarLoading.set(false);
          if (res.data) {
            this.activeSeminar.set(res.data);
            this.registrationForm.patchValue({ seminarId: res.data.id });
          } else {
            this.seminarLoadError.set('No active seminar found. Please use the QR code from a Renaissance University seminar event.');
          }
        },
        error: (err) => {
          this.isSeminarLoading.set(false);
          if (err?.status === 404) {
            this.seminarLoadError.set('Registration is not currently open. Renaissance University will share the QR code when the next seminar is active.');
          } else {
            this.seminarLoadError.set('Unable to connect to the server. Please check your internet connection and try again.');
          }
        }
      });
    }
  }

  copyMobileToWhatsapp(): void {
    const mobile = this.registrationForm.get('mobileNumber')?.value;
    if (mobile && !this.registrationForm.get('whatsappNumber')?.value) {
      this.registrationForm.patchValue({ whatsappNumber: mobile });
    }
  }

  onSameAsMobileChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.sameAsMobile.set(checked);
    const whatsappCtrl = this.registrationForm.get('whatsappNumber')!;
    if (checked) {
      const mobile = this.registrationForm.get('mobileNumber')?.value || '';
      whatsappCtrl.setValue(mobile);
      whatsappCtrl.markAsTouched();
      whatsappCtrl.disable();
    } else {
      whatsappCtrl.enable();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.registrationForm.get(fieldName);
    return !!(control && control.invalid && (control.touched || this.submitted()));
  }

  isFieldValid(fieldName: string): boolean {
    const control = this.registrationForm.get(fieldName);
    return !!(control && control.valid && control.touched);
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const payload: RegistrationRequest = this.registrationForm.getRawValue();

    this.registrationService.register(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.router.navigate(['/success'], { state: { registration: res.data } });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message || 'Submission failed. Please verify your details and try again.');
      }
    });
  }
}
