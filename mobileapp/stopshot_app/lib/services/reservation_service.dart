import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/reservation_model.dart';
import '../models/room_model.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ReservationService {
  static const String baseUrl = 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api';
  final _storage = FlutterSecureStorage();
  
  // Get auth token from secure storage
  Future<String?> _getToken() async {
    return await _storage.read(key: 'auth_token');
  }

  // Get all reservations with optional filters
  Future<List<Reservation>> getReservations({
    String? status,
    String? searchQuery,
  }) async {
    try {
      final token = await _getToken();
      
      String url = '$baseUrl/reservations/';
      List<String> queryParams = [];
      
      if (status != null && status.isNotEmpty && status != 'ALL') {
        queryParams.add('status=$status');
      }
      
      if (searchQuery != null && searchQuery.isNotEmpty) {
        queryParams.add('search=$searchQuery');
      }
      
      if (queryParams.isNotEmpty) {
        url += '?' + queryParams.join('&');
      }
      
      final response = await http.get(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Token $token',
        },
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Reservation.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load reservations: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error getting reservations: $e');
    }
  }
  
  // Get a single reservation by ID
  Future<Reservation> getReservationById(int id) async {
    try {
      final token = await _getToken();
      
      final response = await http.get(
        Uri.parse('$baseUrl/reservations/$id/'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Token $token',
        },
      );
      
      if (response.statusCode == 200) {
        return Reservation.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to load reservation: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error getting reservation: $e');
    }
  }
  
  // Create a new reservation
  Future<Reservation> createReservation(Map<String, dynamic> reservationData) async {
    try {
      final token = await _getToken();
      
      final response = await http.post(
        Uri.parse('$baseUrl/reservations/'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Token $token',
        },
        body: jsonEncode(reservationData),
      );
      
      if (response.statusCode == 201) {
        return Reservation.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to create reservation: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error creating reservation: $e');
    }
  }
  
  // Update an existing reservation
  Future<Reservation> updateReservation(int id, Map<String, dynamic> reservationData) async {
    try {
      final token = await _getToken();
      
      final response = await http.patch(
        Uri.parse('$baseUrl/reservations/$id/'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Token $token',
        },
        body: jsonEncode(reservationData),
      );
      
      if (response.statusCode == 200) {
        return Reservation.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to update reservation: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error updating reservation: $e');
    }
  }
  
  // Update reservation status only
  Future<Reservation> updateReservationStatus(int id, String status) async {
    try {
      final token = await _getToken();
      
      // Send only the status field to a dedicated endpoint
      final response = await http.patch(
        Uri.parse('$baseUrl/reservations/$id/status/'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Token $token',
        },
        body: jsonEncode({'status': status}),
      );
      
      if (response.statusCode == 200) {
        return Reservation.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to update reservation status: ${response.body}');
      }
    } catch (e) {
      throw Exception('Error updating reservation status: $e');
    }
  }
  
  // Delete a reservation
  Future<bool> deleteReservation(int id) async {
    try {
      final token = await _getToken();
      
      final response = await http.delete(
        Uri.parse('$baseUrl/reservations/$id/'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Token $token',
        },
      );
      
      return response.statusCode == 204;
    } catch (e) {
      throw Exception('Error deleting reservation: $e');
    }
  }
  
  // Get all available rooms
  Future<List<Room>> getRooms() async {
    try {
      final token = await _getToken();
      
      final response = await http.get(
        Uri.parse('$baseUrl/rooms/'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Token $token',
        },
      );
      
      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => Room.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load rooms: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error getting rooms: $e');
    }
  }
}