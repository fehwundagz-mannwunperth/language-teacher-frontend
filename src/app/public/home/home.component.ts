import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { HomeSectionKey } from '../../models/editable-home-content.model';
import { HomeContentService } from '../../core/services/home-content.service';
import { LessonServiceService } from '../../core/services/lesson-service.service';
import { TestimonialService } from '../../core/services/testimonial.service';
import { TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { TeacherProfileService } from '../../core/services/teacher-profile.service';
import { SectionCardComponent } from '../../shared/components/section-card/section-card.component';

@Component({
  selector: 'app-home',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, RouterLink, SectionCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnDestroy {
  private readonly teacherProfileService = inject(TeacherProfileService);
  private readonly homeContentService = inject(HomeContentService);
  private readonly lessonServiceService = inject(LessonServiceService);
  private readonly testimonialService = inject(TestimonialService);
  private readonly translationService = inject(TranslationService);
  private readonly carouselIntervalId = window.setInterval(() => this.showNextSlide(), 5000);

  protected readonly homeContent = this.homeContentService.currentHomeContent;
  protected readonly profile$ = this.teacherProfileService.getProfile();
  protected readonly lessonServices = this.lessonServiceService.lessonServices;
  protected readonly testimonials = this.testimonialService.publicTestimonials;
  protected readonly activeSlideIndex = signal(0);
  protected readonly visibleLessonServices = computed(() => {
    const items = this.lessonServices();

    if (items.length <= 3) {
      return items;
    }

    return Array.from({ length: 3 }, (_, offset) => {
      const itemIndex = (this.activeSlideIndex() + offset) % items.length;
      return items[itemIndex];
    });
  });
  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  ngOnDestroy(): void {
    window.clearInterval(this.carouselIntervalId);
  }

  protected hasLessonServiceCarousel(): boolean {
    return this.lessonServices().length > 3;
  }

  protected showSlide(index: number): void {
    this.activeSlideIndex.set(index);
  }

  protected movableSectionOrder(): HomeSectionKey[] {
    return this.homeContent().sectionOrder.filter((sectionKey) => sectionKey !== 'hero');
  }

  private showNextSlide(): void {
    const items = this.lessonServices();

    if (items.length <= 3) {
      return;
    }

    this.activeSlideIndex.update((currentIndex) => (currentIndex + 1) % items.length);
  }
}
