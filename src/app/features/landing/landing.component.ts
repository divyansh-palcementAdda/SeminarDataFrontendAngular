import { Component, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeminarService } from '../../core/services/seminar.service';
import { Seminar } from '../../core/models/seminar.model';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  activeSeminar = signal<Seminar | null>(null);

  constructor(private seminarService: SeminarService) { }

  ngOnInit(): void {
    this.fetchFeaturedSeminar();
  }

  fetchFeaturedSeminar(): void {
    this.seminarService.getAllSeminars().subscribe({
      next: (res) => {
        if (res.data && res.data.content && res.data.content.length > 0) {
          const upcoming = res.data.content.find(s => s.isActive) || res.data.content[0];
          this.activeSeminar.set(upcoming);
        }
      },
      error: () => {
        // Fallback default seminar preview if backend is initializing
        this.activeSeminar.set({
          id: 'c0a80101-0000-0000-0000-000000000001',
          title: 'Career Guidance & Higher Education Awareness Seminar',
          slug: 'career-guidance-seminar-2026',
          description: 'Renaissance University organizes career awareness sessions for 12th standard students, helping them explore higher education pathways, courses, and scholarship opportunities.',
          bannerImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
          venue: 'School Premises / Renaissance University Campus',
          organizer: 'Renaissance University, Chhindwara',
          seminarDate: '2026-09-15T10:00:00',
          registrationEnabled: true,
          certificateEnabled: true,
          emailEnabled: true,
          status: 'UPCOMING',
          isActive: true
        });
      }
    });
  }
}
