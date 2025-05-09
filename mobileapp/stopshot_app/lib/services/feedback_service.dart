import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import '../models/feedback_model.dart';

class FeedbackService {
  // Use localhost or 10.0.2.2 for Android emulator
  final String baseUrl = 'http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api';
  final storage = FlutterSecureStorage();

  Future<List<FeedbackItem>> getFeedback() async {
    try {
      final token = await storage.read(key: 'auth_token');
      
      final response = await http.get(
        Uri.parse('$baseUrl/feedback/'),
        headers: {
          'Authorization': 'Token $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        List<dynamic> feedbackList = json.decode(response.body);
        return feedbackList.map((json) => FeedbackItem.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load feedback: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  Future<void> respondToFeedback(int feedbackId, String responseText) async {
    try {
      final token = await storage.read(key: 'auth_token');
      
      final response = await http.post(
        Uri.parse('$baseUrl/feedback/$feedbackId/response/'),
        headers: {
          'Authorization': 'Token $token',
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'response_text': responseText,
        }),
      );

      if (response.statusCode != 200) {
        throw Exception('Failed to respond to feedback: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }

  Future<void> deleteFeedback(int feedbackId) async {
    try {
      final token = await storage.read(key: 'auth_token');
      
      final response = await http.delete(
        Uri.parse('$baseUrl/feedback/$feedbackId/'),
        headers: {
          'Authorization': 'Token $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode != 204) {
        throw Exception('Failed to delete feedback: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Failed to connect to server: $e');
    }
  }
}