import 'package:flutter/material.dart';
import 'room_model.dart';

enum ReservationStatus {
  PENDING,
  CONFIRMED,
  CANCELLED
}

class Reservation {
  final int id;
  final String guestName;
  final String guestEmail;
  final DateTime reservationDate;
  final TimeOfDay reservationTime;
  final String duration; // Stored as "HH:MM:SS"
  final int numberOfGuests;
  final String specialRequests;
  final ReservationStatus status;
  final Room? room;
  final String roomType;
  final DateTime createdAt;
  final DateTime updatedAt;

  Reservation({
    required this.id,
    required this.guestName,
    required this.guestEmail,
    required this.reservationDate,
    required this.reservationTime,
    required this.duration,
    required this.numberOfGuests,
    this.specialRequests = '',
    required this.status,
    this.room,
    required this.roomType,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Reservation.fromJson(Map<String, dynamic> json) {
    // Parse time string into TimeOfDay
    TimeOfDay parseTime(String timeString) {
      final parts = timeString.split(':');
      return TimeOfDay(
        hour: int.parse(parts[0]),
        minute: int.parse(parts[1]),
      );
    }

    // Parse status string into enum
    ReservationStatus parseStatus(String statusString) {
      switch (statusString.toUpperCase()) {
        case 'PENDING':
          return ReservationStatus.PENDING;
        case 'CONFIRMED':
          return ReservationStatus.CONFIRMED;
        case 'CANCELLED':
          return ReservationStatus.CANCELLED;
        default:
          return ReservationStatus.PENDING;
      }
    }

    return Reservation(
      id: json['id'],
      guestName: json['guest_name'],
      guestEmail: json['guest_email'],
      reservationDate: DateTime.parse(json['reservation_date']),
      reservationTime: parseTime(json['reservation_time']),
      duration: json['duration'] ?? '01:00:00',
      numberOfGuests: json['number_of_guests'],
      specialRequests: json['special_requests'] ?? '',
      status: parseStatus(json['status']),
      room: json['room'] != null ? Room.fromJson(json['room']) : null,
      roomType: json['room_type'],
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }

  Map<String, dynamic> toJson() {
    // Format TimeOfDay to string HH:MM:SS
    String formatTime(TimeOfDay time) {
      String hour = time.hour.toString().padLeft(2, '0');
      String minute = time.minute.toString().padLeft(2, '0');
      return '$hour:$minute:00';
    }

    // Convert enum to string
    String statusToString(ReservationStatus status) {
      switch (status) {
        case ReservationStatus.PENDING:
          return 'PENDING';
        case ReservationStatus.CONFIRMED:
          return 'CONFIRMED';
        case ReservationStatus.CANCELLED:
          return 'CANCELLED';
      }
    }

    return {
      'id': id,
      'guest_name': guestName,
      'guest_email': guestEmail,
      'reservation_date': reservationDate.toIso8601String().split('T')[0],
      'reservation_time': formatTime(reservationTime),
      'duration': duration,
      'number_of_guests': numberOfGuests,
      'special_requests': specialRequests,
      'status': statusToString(status),
      'room_id': room?.id,
      'room_type': roomType,
    };
  }

  // For creating a new reservation (without ID)
  Map<String, dynamic> toJsonForCreate() {
    final map = toJson();
    map.remove('id');
    return map;
  }

  // Copy with method for creating a modified copy
  Reservation copyWith({
    int? id,
    String? guestName,
    String? guestEmail,
    DateTime? reservationDate,
    TimeOfDay? reservationTime,
    String? duration,
    int? numberOfGuests,
    String? specialRequests,
    ReservationStatus? status,
    Room? room,
    String? roomType,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Reservation(
      id: id ?? this.id,
      guestName: guestName ?? this.guestName,
      guestEmail: guestEmail ?? this.guestEmail,
      reservationDate: reservationDate ?? this.reservationDate,
      reservationTime: reservationTime ?? this.reservationTime,
      duration: duration ?? this.duration,
      numberOfGuests: numberOfGuests ?? this.numberOfGuests,
      specialRequests: specialRequests ?? this.specialRequests,
      status: status ?? this.status,
      room: room ?? this.room,
      roomType: roomType ?? this.roomType,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}