import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { LanguageCode, TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { BookingCalendarService } from '../../core/services/booking-calendar.service';
import { BookingStatus } from '../../models/booking-status.type';
import { BookingSlot } from '../../models/booking-slot.model';

@Component({
  selector: 'app-calendar',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  private readonly bookingCalendarService = inject(BookingCalendarService);
  private readonly translationService = inject(TranslationService);

  protected selectedWeekStart = this.getMondayDateKey(new Date());
  protected calendar$ = this.bookingCalendarService.getWeeklyCalendar(this.selectedWeekStart);
  protected readonly statuses: BookingStatus[] = ['AVAILABLE', 'BOOKED', 'PENDING', 'UNAVAILABLE'];
  protected readonly statusLabelKeys: Record<BookingStatus, TranslationKey> = {
    AVAILABLE: 'calendar.status.available',
    BOOKED: 'calendar.status.booked',
    PENDING: 'calendar.status.pending',
    UNAVAILABLE: 'calendar.status.unavailable',
  };

  protected formatDay(dateKey: string): string {
    const date = new Date(`${dateKey}T00:00:00`);
    return new Intl.DateTimeFormat(this.locale(), {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  protected formatWeekRange(weekStart: string, weekEnd: string): string {
    const start = new Date(`${weekStart}T00:00:00`);
    const end = new Date(`${weekEnd}T00:00:00`);
    const formatter = new Intl.DateTimeFormat(this.locale(), {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `${formatter.format(start)} - ${formatter.format(end)}`;
  }

  protected formatSlotTime(slot: BookingSlot): string {
    return `${this.formatTime(slot.start)}-${this.formatTime(slot.end)}`;
  }

  protected goToPreviousWeek(): void {
    this.loadWeek(this.addDays(this.parseDateKey(this.selectedWeekStart), -7));
  }

  protected goToNextWeek(): void {
    this.loadWeek(this.addDays(this.parseDateKey(this.selectedWeekStart), 7));
  }

  protected goToThisWeek(): void {
    this.loadWeek(new Date());
  }

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  private loadWeek(date: Date): void {
    this.selectedWeekStart = this.getMondayDateKey(date);
    this.calendar$ = this.bookingCalendarService.getWeeklyCalendar(this.selectedWeekStart);
  }

  private formatTime(value: string): string {
    return value.slice(11, 16);
  }

  private getMondayDateKey(date: Date): string {
    const monday = new Date(date);
    const day = monday.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    monday.setDate(monday.getDate() + offset);
    monday.setHours(0, 0, 0, 0);
    return this.toDateKey(monday);
  }

  private addDays(date: Date, days: number): Date {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  }

  private parseDateKey(dateKey: string): Date {
    return new Date(`${dateKey}T00:00:00`);
  }

  private toDateKey(date: Date): string {
    return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private locale(): string {
    const languageToLocale: Record<LanguageCode, string> = {
      hu: 'hu-HU',
      en: 'en-US',
    };

    return languageToLocale[this.translationService.currentLanguage()];
  }
}
