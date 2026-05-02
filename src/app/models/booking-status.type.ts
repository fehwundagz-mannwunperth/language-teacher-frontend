export type BookingStatus = 'AVAILABLE' | 'BOOKED' | 'PENDING' | 'UNAVAILABLE';

export type BackendBookingStatus = Extract<BookingStatus, 'BOOKED' | 'PENDING'>;
