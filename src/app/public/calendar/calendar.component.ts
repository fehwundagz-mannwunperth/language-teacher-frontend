import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { LanguageCode, TranslationKey } from '../../core/i18n/language.model';
import { TranslationService } from '../../core/i18n/translation.service';
import { BookingCalendarService } from '../../core/services/booking-calendar.service';
import { BookingStatus } from '../../models/booking-status.type';
import { BookingConflictResponse, BookingSlot } from '../../models/booking-slot.model';
import {
  BookingDialogComponent,
  BookingDialogResult,
} from './booking-dialog/booking-dialog.component';

@Component({
  selector: 'app-calendar',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatIconModule, MatSnackBarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  private readonly bookingCalendarService = inject(BookingCalendarService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
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

  protected openBookingDialog(slot: BookingSlot): void {
    if (slot.status !== 'AVAILABLE') {
      return;
    }

    const dialogRef = this.dialog.open(BookingDialogComponent, {
      data: { slotTime: this.formatSlotTime(slot) },
      maxWidth: 'calc(100vw - 2rem)',
      width: '28rem',
    });

    dialogRef.afterClosed().subscribe((result?: BookingDialogResult) => {
      if (!result) {
        return;
      }

      this.createBooking(slot, result);
    });
  }

  protected t(key: TranslationKey): string {
    return this.translationService.translate(key);
  }

  private loadWeek(date: Date): void {
    this.selectedWeekStart = this.getMondayDateKey(date);
    this.calendar$ = this.bookingCalendarService.getWeeklyCalendar(this.selectedWeekStart);
  }

  private createBooking(slot: BookingSlot, result: BookingDialogResult): void {
    this.bookingCalendarService
      .createBooking({
        start: slot.start,
        end: slot.end,
        customerName: result.customerName,
        customerEmail: result.customerEmail,
      })
      .subscribe({
        next: (booking) => {
          slot.status = booking.status;
          this.showSuccess('calendar.booking.success');
        },
        error: (error: unknown) => {
          if (this.isConflictError(error)) {
            this.showError('calendar.booking.conflict');
            this.reloadSelectedWeek();
            return;
          }

          this.showError('calendar.booking.unexpectedError');
        },
      });
  }

  private reloadSelectedWeek(): void {
    this.calendar$ = this.bookingCalendarService.getWeeklyCalendar(this.selectedWeekStart);
  }

  private showSuccess(key: TranslationKey): void {
    this.snackBar.open(this.t(key), this.t('calendar.snackbar.close'), {
      duration: 4200,
      panelClass: 'success-snackbar',
    });
  }

  private showError(key: TranslationKey): void {
    this.snackBar.open(this.t(key), this.t('calendar.snackbar.close'), {
      duration: 5200,
      panelClass: 'error-snackbar',
    });
  }

  private isConflictError(error: unknown): error is BookingConflictResponse {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'SLOT_NOT_AVAILABLE'
    );
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
