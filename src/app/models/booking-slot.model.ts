import { BackendBookingStatus, BookingStatus } from './booking-status.type';

export interface BackendBookingSlot {
  start: string;
  end: string;
  status: BackendBookingStatus;
}

export type BookingDayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';

export interface BackendBookingDay {
  date: string;
  dayKey: BookingDayKey;
  slots: BackendBookingSlot[];
}

export interface BackendBookingCalendarResponse {
  weekStart: string;
  weekEnd: string;
  days: BackendBookingDay[];
}

export interface BookingSlot {
  start: string;
  end: string;
  status: BookingStatus;
}

export interface BookingCalendarDay {
  date: string;
  dayKey: BookingDayKey;
  slots: BookingSlot[];
}

export interface BookingCalendar {
  weekStart: string;
  weekEnd: string;
  days: BookingCalendarDay[];
  timeLabels: string[];
}
