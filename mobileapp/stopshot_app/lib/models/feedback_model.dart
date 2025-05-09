class FeedbackUser {
  final String username;
  final String email;
  final String firstName;
  final String lastName;
  final String? phoneNum;
  final String role;

  FeedbackUser({
    required this.username,
    required this.email,
    required this.firstName,
    required this.lastName,
    this.phoneNum,
    required this.role,
  });

  factory FeedbackUser.fromJson(Map<String, dynamic> json) {
    return FeedbackUser(
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      phoneNum: json['phone_num'],
      role: json['role'] ?? '',
    );
  }
}

// Renamed from Feedback to FeedbackItem to avoid conflicts with Flutter's Feedback class
class FeedbackItem {
  final int feedbackId;
  final FeedbackUser user;
  final String feedbackText;
  String? responseText;
  final int experienceRating;
  final DateTime createdAt;
  final DateTime updatedAt;

  FeedbackItem({
    required this.feedbackId,
    required this.user,
    required this.feedbackText,
    this.responseText,
    required this.experienceRating,
    required this.createdAt,
    required this.updatedAt,
  });

  factory FeedbackItem.fromJson(Map<String, dynamic> json) {
    return FeedbackItem(
      feedbackId: json['feedback_id'],
      user: FeedbackUser.fromJson(json['user']),
      feedbackText: json['feedback_text'] ?? '',
      responseText: json['response_text'],
      experienceRating: json['experience_rating'] ?? 0,
      createdAt: DateTime.parse(json['created_at']),
      updatedAt: DateTime.parse(json['updated_at']),
    );
  }
}