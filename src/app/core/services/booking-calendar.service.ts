import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import {
  BackendBookingCalendarResponse,
  BackendBookingDay,
  BackendBookingSlot,
  BookingConflictResponse,
  BookingCreateRequest,
  BookingDayKey,
  BookingCalendar,
  BookingSlot,
} from '../../models/booking-slot.model';

const BOOKABLE_START_HOUR = 8;
const BOOKABLE_END_HOUR = 18;
const SLOT_MINUTES = 30;
const WEEKDAYS = 5;
const DAY_KEYS: BookingDayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const CONFLICT_MOCK_STARTS = new Set(['2026-04-27T10:00:00', '2026-05-04T10:00:00']);
const UNEXPECTED_ERROR_MOCK_STARTS = new Set(['2026-04-27T10:30:00', '2026-05-04T10:30:00']);

@Injectable({ providedIn: 'root' })
export class BookingCalendarService {
  private readonly createdBookings: BackendBookingSlot[] = [];

  public getWeeklyCalendar(weekStart: string): Observable<BookingCalendar> {
    // Future Spring Boot endpoint: GET /api/public/calendar/bookings?weekStart=YYYY-MM-DD
    return of(this.buildWeeklyCalendar(this.getMockBackendResponse(weekStart)));
  }

  public createBooking(request: BookingCreateRequest): Observable<BackendBookingSlot> {
    // Future Spring Boot endpoint: POST /api/public/calendar/bookings
    if (CONFLICT_MOCK_STARTS.has(request.start)) {
      return throwError(
        () =>
          ({
            code: 'SLOT_NOT_AVAILABLE',
            message: 'This time slot is no longer available.',
          }) satisfies BookingConflictResponse,
      );
    }

    if (UNEXPECTED_ERROR_MOCK_STARTS.has(request.start)) {
      return throwError(() => new Error('Unexpected booking error'));
    }

    const pendingBooking: BackendBookingSlot = {
      start: request.start,
      end: request.end,
      status: 'PENDING',
    };

    this.createdBookings.push(pendingBooking);
    return of(pendingBooking);
  }

  private buildWeeklyCalendar(response: BackendBookingCalendarResponse): BookingCalendar {
    const timeLabels = this.buildTimeLabels();
    const bookingByStart = new Map(
      response.days.flatMap((day) => day.slots).map((booking) => [booking.start, booking]),
    );

    const days = Array.from({ length: WEEKDAYS }, (_, dayOffset) => {
      const day = this.addDays(this.parseDateKey(response.weekStart), dayOffset);
      const date = this.toDateKey(day);
      const responseDay = response.days.find((backendDay) => backendDay.date === date);

      return {
        date,
        dayKey: responseDay?.dayKey ?? DAY_KEYS[dayOffset],
        slots: timeLabels.map((timeLabel) => {
          const start = this.createLocalDateTime(day, timeLabel);
          const end = new Date(start.getTime() + SLOT_MINUTES * 60_000);
          const startKey = this.toLocalDateTimeKey(start);
          const backendBooking = bookingByStart.get(startKey);

          if (backendBooking) {
            return backendBooking;
          }

          return {
            start: startKey,
            end: this.toLocalDateTimeKey(end),
            status: this.isBookableSlot(start, end) ? 'AVAILABLE' : 'UNAVAILABLE',
          } satisfies BookingSlot;
        }),
      };
    });

    return {
      weekStart: response.weekStart,
      weekEnd: response.weekEnd,
      days,
      timeLabels,
    };
  }

  private getMockBackendResponse(weekStart: string): BackendBookingCalendarResponse {
    const weekStartDate = this.parseDateKey(weekStart);
    const weekEnd = this.toDateKey(this.addDays(weekStartDate, 4));
    const emptyDays = this.buildEmptyBackendDays(weekStartDate);
    const mockResponses: Record<string, BackendBookingCalendarResponse> = {
      '2026-04-27': {
        weekStart: '2026-04-27',
        weekEnd: '2026-05-01',
        days: this.mergeMockSlots(this.buildEmptyBackendDays(new Date(2026, 3, 27)), {
          '2026-04-28': [
            {
              start: '2026-04-28T11:00:00',
              end: '2026-04-28T11:30:00',
              status: 'BOOKED',
            },
          ],
          '2026-04-30': [
            {
              start: '2026-04-30T16:00:00',
              end: '2026-04-30T16:30:00',
              status: 'PENDING',
            },
          ],
        }),
      },
      '2026-05-04': {
        weekStart: '2026-05-04',
        weekEnd: '2026-05-08',
        days: this.mergeMockSlots(this.buildEmptyBackendDays(new Date(2026, 4, 4)), {
          '2026-05-04': [
            {
              start: '2026-05-04T08:00:00',
              end: '2026-05-04T08:30:00',
              status: 'BOOKED',
            },
            {
              start: '2026-05-04T09:00:00',
              end: '2026-05-04T09:30:00',
              status: 'PENDING',
            },
          ],
          '2026-05-06': [
            {
              start: '2026-05-06T14:30:00',
              end: '2026-05-06T15:00:00',
              status: 'BOOKED',
            },
          ],
          '2026-05-08': [
            {
              start: '2026-05-08T10:30:00',
              end: '2026-05-08T11:00:00',
              status: 'PENDING',
            },
          ],
        }),
      },
      '2026-05-11': {
        weekStart: '2026-05-11',
        weekEnd: '2026-05-15',
        days: this.mergeMockSlots(this.buildEmptyBackendDays(new Date(2026, 4, 11)), {
          '2026-05-12': [
            {
              start: '2026-05-12T13:00:00',
              end: '2026-05-12T13:30:00',
              status: 'PENDING',
            },
          ],
          '2026-05-15': [
            {
              start: '2026-05-15T15:30:00',
              end: '2026-05-15T16:00:00',
              status: 'BOOKED',
            },
          ],
        }),
      },
    };

    const response = mockResponses[weekStart] ?? {
      weekStart,
      weekEnd,
      days: emptyDays,
    };

    return this.applyCreatedBookings(response);
  }

  private applyCreatedBookings(
    response: BackendBookingCalendarResponse,
  ): BackendBookingCalendarResponse {
    return {
      ...response,
      days: response.days.map((day) => ({
        ...day,
        slots: [
          ...day.slots,
          ...this.createdBookings.filter((booking) => booking.start.startsWith(`${day.date}T`)),
        ],
      })),
    };
  }

  private buildEmptyBackendDays(weekStart: Date): BackendBookingDay[] {
    return Array.from({ length: WEEKDAYS }, (_, dayOffset) => {
      const day = this.addDays(weekStart, dayOffset);

      return {
        date: this.toDateKey(day),
        dayKey: DAY_KEYS[dayOffset],
        slots: [],
      };
    });
  }

  private mergeMockSlots(
    days: BackendBookingDay[],
    slotsByDate: Record<string, BackendBookingDay['slots']>,
  ): BackendBookingDay[] {
    return days.map((day) => ({
      ...day,
      slots: slotsByDate[day.date] ?? day.slots,
    }));
  }

  private buildTimeLabels(): string[] {
    const startMinutes = BOOKABLE_START_HOUR * 60;
    const endMinutes = BOOKABLE_END_HOUR * 60;
    const labels: string[] = [];

    for (let minutes = startMinutes; minutes <= endMinutes; minutes += SLOT_MINUTES) {
      labels.push(this.toTimeLabel(minutes));
    }

    return labels;
  }

  private isBookableSlot(start: Date, end: Date): boolean {
    const day = start.getDay();
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();

    return (
      day >= 1 &&
      day <= 5 &&
      startMinutes >= BOOKABLE_START_HOUR * 60 &&
      endMinutes <= BOOKABLE_END_HOUR * 60
    );
  }

  private addDays(date: Date, days: number): Date {
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + days);
    return nextDate;
  }

  private parseDateKey(dateKey: string): Date {
    return new Date(`${dateKey}T00:00:00`);
  }

  private createLocalDateTime(date: Date, timeLabel: string): Date {
    const [hours, minutes] = timeLabel.split(':').map(Number);
    const slotDate = new Date(date);
    slotDate.setHours(hours, minutes, 0, 0);
    return slotDate;
  }

  private toTimeLabel(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    return `${this.pad(hours)}:${this.pad(remainder)}`;
  }

  private toDateKey(date: Date): string {
    return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`;
  }

  private toLocalDateTimeKey(date: Date): string {
    return `${this.toDateKey(date)}T${this.pad(date.getHours())}:${this.pad(
      date.getMinutes(),
    )}:00`;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}
