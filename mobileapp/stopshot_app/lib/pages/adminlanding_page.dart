import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'reservation_page.dart';
import '../services/reservation_service.dart';
import '../models/reservation_model.dart';
import 'feedback_page.dart';

class AdminLandingPage extends StatefulWidget {
  @override
  _AdminLandingPageState createState() => _AdminLandingPageState();
}

class _AdminLandingPageState extends State<AdminLandingPage> {
  late Future<Map<String, dynamic>> _dashboardData;
  final ReservationService _reservationService = ReservationService();
  
  @override
  void initState() {
    super.initState();
    _dashboardData = fetchDashboardData();
  }

  Future<Map<String, dynamic>> fetchDashboardData() async {
    try {
      // Fetch real reservation data from the API
      List<Reservation> allReservations = await _reservationService.getReservations();
      List<Reservation> pendingReservations = await _reservationService.getReservations(status: 'PENDING');
      List<Reservation> confirmedReservations = await _reservationService.getReservations(status: 'CONFIRMED');
      List<Reservation> cancelledReservations = await _reservationService.getReservations(status: 'CANCELLED');
      
      // Get most recent 3 reservations, sorted by date
      List<Reservation> recentReservations = List.from(allReservations)
        ..sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
      
      if (recentReservations.length > 3) {
        recentReservations = recentReservations.sublist(0, 3);
      }
      
      // Convert recent reservations to the format needed for display
      List<Map<String, dynamic>> recentReservationsFormatted = recentReservations.map((res) => {
        "id": res.id,
        "guest_name": res.guestName,
        "status": res.status.toString().split('.').last,
        "date": '${res.reservationDate.year}-${res.reservationDate.month.toString().padLeft(2, '0')}-${res.reservationDate.day.toString().padLeft(2, '0')}',
      }).toList();
      
      // Include feedback count in metrics for the dashboard
      int feedbackCount = await _fetchFeedbackCount();
      
      // Get recent feedback
      List<dynamic> recentFeedback = await _fetchRecentFeedback();
      
      return {
        "metrics": {
          "total_reservations": allReservations.length,
          "pending_reservations": pendingReservations.length,
          "confirmed_reservations": confirmedReservations.length,
          "canceled_reservations": cancelledReservations.length,
          "feedback": feedbackCount,
          "revenue_today": "\$2,450"
        },
        "recent_reservations": recentReservationsFormatted,
        "recent_feedback": recentFeedback,
      };
    } catch (e) {
      throw Exception('Failed to load dashboard data: $e');
    }
  }
  
  // New method to fetch feedback count
  Future<int> _fetchFeedbackCount() async {
    try {
      final storage = FlutterSecureStorage();
      final token = await storage.read(key: 'auth_token');
      
      if (token == null) {
        return 0; // Return 0 if not authenticated
      }
      
      final response = await http.get(
        Uri.parse('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/feedback/'),
        headers: {
          'Authorization': 'Token $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        List<dynamic> feedbackList = json.decode(response.body);
        return feedbackList.length;
      } else {
        print('Error fetching feedback count: ${response.statusCode}');
        return 0;
      }
    } catch (e) {
      print('Error fetching feedback count: $e');
      return 0;
    }
  }

  // Method to fetch recent feedback
  Future<List<dynamic>> _fetchRecentFeedback() async {
    try {
      final storage = FlutterSecureStorage();
      final token = await storage.read(key: 'auth_token');
      
      if (token == null) {
        return []; // Return empty list if not authenticated
      }
      
      final response = await http.get(
        Uri.parse('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/feedback/'),
        headers: {
          'Authorization': 'Token $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        List<dynamic> feedbackList = json.decode(response.body);
        // Sort by creation date (newest first) and take top 3
        feedbackList.sort((a, b) => 
          DateTime.parse(b['created_at']).compareTo(DateTime.parse(a['created_at']))
        );
        return feedbackList.take(3).toList();
      } else {
        print('Error fetching recent feedback: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('Error fetching recent feedback: $e');
      return [];
    }
  }

  // Navigate to the specified management section
  void _navigateToSection(String section) {
    Widget page;
    
    switch (section) {
      case 'reservations':
        page = ReservationPage();
        break;
      case 'feedback':
        page = FeedbackPage();
        break;
      case 'menu':
      case 'employees':
        // Placeholder for future implementation
        page = Scaffold(
          backgroundColor: Color(0xFF151515),
          appBar: AppBar(
            title: Text('$section Management'),
            backgroundColor: Color(0xFF1E1E1E),
          ),
          body: Center(
            child: Text(
              '$section Management Coming Soon',
              style: TextStyle(color: Colors.white),
            ),
          ),
        );
        break;
      default:
        return;
    }
    
    Navigator.push(context, MaterialPageRoute(builder: (context) => page));
  }

  // Build metric boxes for the dashboard - fix overflow issues
  Widget _buildMetricBox(String title, String value, IconData icon) {
    return Container(
      width: 160,
      height: 100, // Increased height to prevent overflow
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Color(0xFF262626),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Color(0xFF363636), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Flexible(
                child: Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFFAAAAAA),
                  ),
                  overflow: TextOverflow.ellipsis, // Handle text overflow
                ),
              ),
              Icon(
                icon, 
                color: Color(0xFFD38236), 
                size: 20
              ),
            ],
          ),
          SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  // Build navigation cards for the admin features
  Widget _buildFeatureCard(String title, String description, IconData icon, String route) {
    return Card(
      color: Color(0xFF262626),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: InkWell(
        onTap: () => _navigateToSection(route),
        borderRadius: BorderRadius.circular(16),
        splashColor: Color(0xFFD38236).withOpacity(0.2),
        highlightColor: Color(0xFFD38236).withOpacity(0.1),
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Color(0xFFD38236).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: Color(0xFFD38236),
                  size: 28,
                ),
              ),
              SizedBox(height: 16),
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              SizedBox(height: 6),
              Text(
                description,
                style: TextStyle(
                  fontSize: 14,
                  color: Color(0xFFAAAAAA),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecentReservationsCard(List<dynamic> reservations) {
    return Card(
      color: Color(0xFF262626),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Recent Reservations',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                TextButton(
                  onPressed: () => _navigateToSection('reservations'),
                  child: Text(
                    'View All',
                    style: TextStyle(
                      color: Color(0xFFD38236),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            reservations.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'No recent reservations found',
                        style: TextStyle(color: Colors.white70),
                      ),
                    ),
                  )
                : Column(
                    children: reservations.map((reservation) {
                      // Status color
                      Color statusColor;
                      switch (reservation['status']) {
                        case 'CONFIRMED':
                          statusColor = Colors.green;
                          break;
                        case 'PENDING':
                          statusColor = Colors.orange;
                          break;
                        case 'CANCELLED':
                          statusColor = Colors.red;
                          break;
                        default:
                          statusColor = Colors.grey;
                      }
                      
                      return Container(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          border: Border(
                            bottom: BorderSide(
                              color: Color(0xFF363636),
                              width: 1,
                            ),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Row(
                              children: [
                                Container(
                                  width: 40,
                                  height: 40,
                                  decoration: BoxDecoration(
                                    color: Color(0xFF363636),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Center(
                                    child: Text(
                                      '${reservation['id']}',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                                SizedBox(width: 12),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      reservation['guest_name'],
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    Text(
                                      reservation['date'],
                                      style: TextStyle(
                                        color: Color(0xFFAAAAAA),
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                            Container(
                              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: statusColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(4),
                                border: Border.all(
                                  color: statusColor,
                                  width: 1,
                                ),
                              ),
                              child: Text(
                                reservation['status'],
                                style: TextStyle(
                                  color: statusColor,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentFeedbackCard(List<dynamic> feedbacks) {
    return Card(
      color: Color(0xFF262626),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Recent Feedback',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                TextButton(
                  onPressed: () => _navigateToSection('feedback'),
                  child: Text(
                    'View All',
                    style: TextStyle(
                      color: Color(0xFFD38236),
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            feedbacks.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Text(
                        'No recent feedback found',
                        style: TextStyle(color: Colors.white70),
                      ),
                    ),
                  )
                : Column(
                    children: feedbacks.map((feedback) {
                      return Container(
                        padding: EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          border: Border(
                            bottom: BorderSide(
                              color: Color(0xFF363636),
                              width: 1,
                            ),
                          ),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    CircleAvatar(
                                      backgroundColor: Color(0xFFD38236),
                                      child: Text(
                                        feedback['user']['first_name'] != null && 
                                        feedback['user']['first_name'].isNotEmpty
                                            ? feedback['user']['first_name'][0].toUpperCase()
                                            : feedback['user']['username'][0].toUpperCase(),
                                        style: TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    SizedBox(width: 12),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          '${feedback['user']['first_name'] ?? ''} ${feedback['user']['last_name'] ?? ''}'.trim(),
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.w500,
                                          ),
                                        ),
                                        Text(
                                          _formatDate(feedback['created_at']),
                                          style: TextStyle(
                                            color: Color(0xFFAAAAAA),
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                Row(
                                  children: List.generate(
                                    5,
                                    (index) => Icon(
                                      index < feedback['experience_rating'] ? Icons.star : Icons.star_border,
                                      color: Color(0xFFD38236),
                                      size: 14,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 8),
                            Text(
                              feedback['feedback_text'] ?? '',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 14,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
          ],
        ),
      ),
    );
  }

  // Helper method to format date
  String _formatDate(String dateString) {
    final date = DateTime.parse(dateString).toLocal();
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final isMobile = screenSize.width < 600;
    
    return Scaffold(
      backgroundColor: Color(0xFF151515),
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset(
              'assets/logo/logo.png',
              height: 36,
            ),
          ],
        ),
        backgroundColor: Color(0xFF1E1E1E),
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh, color: Colors.white,),
            onPressed: () {
              setState(() {
                _dashboardData = fetchDashboardData();
              });
            },
          ),
          // IconButton(
          //   icon: Icon(Icons.notifications_outlined),
          //   onPressed: () {
          //     // Handle notifications
          //   },
          // ),
          // IconButton(
          //   icon: Icon(Icons.account_circle_outlined),
          //   onPressed: () {
          //     // Handle profile
          //   },
          // ),
          // Convert logout to icon-only on mobile
          isMobile ? IconButton(
            icon: Icon(Icons.exit_to_app, color: Colors.white70),
            onPressed: () async {
              final storage = FlutterSecureStorage();
              await storage.delete(key: 'auth_token');
              Navigator.pop(context);
            },
          ) : TextButton.icon(
            onPressed: () async {
              final storage = FlutterSecureStorage();
              await storage.delete(key: 'auth_token');
              Navigator.pop(context);
            },
            icon: Icon(
              Icons.exit_to_app,
              color: Colors.white70,
            ),
            label: Text(
              'Logout',
              style: TextStyle(color: Colors.white70),
            ),
          ),
        ],
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _dashboardData,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(
              child: CircularProgressIndicator(color: Color(0xFFD38236)),
            );
          }
          
          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Error loading dashboard data: ${snapshot.error}',
                    style: TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                  SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _dashboardData = fetchDashboardData();
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFFD38236),
                    ),
                    child: Text('Retry'),
                  ),
                ],
              ),
            );
          }
          
          final data = snapshot.data!;
          final metrics = data['metrics'];
          final recentReservations = data['recent_reservations'];
          final recentFeedback = data['recent_feedback'];
          
          return SingleChildScrollView(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Welcome section
                Text(
                  'Dashboard',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 6),
                Text(
                  'Welcome back, Admin',
                  style: TextStyle(
                    fontSize: 14,
                    color: Color(0xFFAAAAAA),
                  ),
                ),
                SizedBox(height: 24),
                
                // Key metrics
                Text(
                  'Key Metrics',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 16),
                
                // Metrics cards - redesigned for mobile
                Column(
                  children: [
                    // Row 1: Reservations + Feedback
                    Row(
                      children: [
                        Expanded(
                          child: _buildMetricBox('All Reservations', '${metrics["total_reservations"]}', Icons.book_online),
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: _buildMetricBox('Feedback', '${metrics["feedback"]}', Icons.feedback),
                        ),
                      ],
                    ),
                    SizedBox(height: 12),
                    
                    // Row 2: Status metrics - Pending, Confirmed, Canceled
                    Row(
                      children: [
                        Expanded(
                          child: _buildStatusMetricBox('Pending', '${metrics["pending_reservations"]}', Icons.pending_actions, Colors.orange),
                        ),
                        SizedBox(width: 8),
                        Expanded(
                          child: _buildStatusMetricBox('Confirmed', '${metrics["confirmed_reservations"]}', Icons.check_circle, Colors.green),
                        ),
                        SizedBox(width: 8),
                        Expanded(
                          child: _buildStatusMetricBox('Canceled', '${metrics["canceled_reservations"]}', Icons.cancel, Colors.red),
                        ),
                      ],
                    ),
                  ],
                ),
                
                SizedBox(height: 30),
                
                // Quick actions section - replacing the Management grid
                Text(
                  'Quick Actions',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 16),
                
                // Quick action buttons
                Row(
                  children: [
                    Expanded(
                      child: _buildActionButton(
                        'Reservations',
                        Icons.book_online,
                        () => _navigateToSection('reservations'),
                      ),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: _buildActionButton(
                        'Feedback',
                        Icons.feedback,
                        () => _navigateToSection('feedback'),
                      ),
                    ),
                  ],
                ),
                
                SizedBox(height: 30),
                
                // Recent reservations
                _buildRecentReservationsCard(recentReservations),
                
                SizedBox(height: 24),

                // Recent feedback
                _buildRecentFeedbackCard(recentFeedback),
                
                SizedBox(height: 24),
              ],
            ),
          );
        },
      ),
    );
  }

  // Fix the status metric box that also has overflow
  Widget _buildStatusMetricBox(String title, String value, IconData icon, Color color) {
    return Container(
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Color(0xFF262626),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3), width: 1),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 20),
          SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            overflow: TextOverflow.ellipsis, // Handle potential overflow
          ),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: Color(0xFFAAAAAA),
            ),
            overflow: TextOverflow.ellipsis, // Handle potential overflow
          ),
        ],
      ),
    );
  }

  // New action button widget
  Widget _buildActionButton(String title, IconData icon, VoidCallback onPressed) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: Color(0xFF262626),
        padding: EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(color: Color(0xFF363636), width: 1),
        ),
      ),
      child: Column(
        children: [
          Icon(
            icon,
            color: Color(0xFFD38236),
            size: 24,
          ),
          SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(
              color: Colors.white,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}