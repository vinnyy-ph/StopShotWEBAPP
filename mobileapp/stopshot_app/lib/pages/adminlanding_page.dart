import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'reservation_page.dart';
import '../services/reservation_service.dart';
import '../models/reservation_model.dart';

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
      
      // For other metrics, use dummy data for now
      // In a real app, you would fetch these from appropriate API endpoints
      return {
        "metrics": {
          "total_reservations": allReservations.length,
          "pending_reservations": pendingReservations.length,
          "confirmed_reservations": confirmedReservations.length,
          "canceled_reservations": cancelledReservations.length,
          "employees": 12,
          "menu_items": 42,
          "feedback": 18,
          "revenue_today": "\$2,450"
        },
        "recent_reservations": recentReservationsFormatted,
      };
    } catch (e) {
      throw Exception('Failed to load dashboard data: $e');
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

  // Build metric boxes for the dashboard
  Widget _buildMetricBox(String title, String value, IconData icon) {
    return Container(
      width: 160,
      height: 90,
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
              Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFFAAAAAA),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF151515),
      appBar: AppBar(
        title: Row(
          children: [
            Image.asset(
              'assets/logo/logo.png',
              height: 36,
            ),
            SizedBox(width: 12),
            Text(
              'StopShot Admin',
              style: TextStyle(color: Colors.white),
            ),
          ],
        ),
        backgroundColor: Color(0xFF1E1E1E),
        elevation: 0,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () {
              setState(() {
                _dashboardData = fetchDashboardData();
              });
            },
          ),
          IconButton(
            icon: Icon(Icons.notifications_outlined),
            onPressed: () {
              // Handle notifications
            },
          ),
          IconButton(
            icon: Icon(Icons.account_circle_outlined),
            onPressed: () {
              // Handle profile
            },
          ),
          TextButton.icon(
            onPressed: () async {
              // Clear token on logout
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
          
          return SingleChildScrollView(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Welcome section
                Text(
                  'Dashboard',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 6),
                Text(
                  'Welcome back, Admin',
                  style: TextStyle(
                    fontSize: 16,
                    color: Color(0xFFAAAAAA),
                  ),
                ),
                SizedBox(height: 24),
                
                // Key metrics
                Text(
                  'Key Metrics',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 16),
                
                // Metrics grid
                Wrap(
                  spacing: 16,
                  runSpacing: 16,
                  children: [
                    _buildMetricBox('Reservations', '${metrics["total_reservations"]}', Icons.book_online),
                    _buildMetricBox('Pending', '${metrics["pending_reservations"]}', Icons.pending_actions),
                    _buildMetricBox('Confirmed', '${metrics["confirmed_reservations"]}', Icons.check_circle),
                    _buildMetricBox('Canceled', '${metrics["canceled_reservations"]}', Icons.cancel),
                  ],
                ),
                
                SizedBox(height: 32),
                
                // Quick access section
                Text(
                  'Management',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                SizedBox(height: 16),
                
                // Management cards in a grid
                GridView.count(
                  crossAxisCount: 2,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  children: [
                    _buildFeatureCard(
                      'Reservations',
                      'Manage customer bookings and tables',
                      Icons.book_online,
                      'reservations',
                    ),
                    _buildFeatureCard(
                      'Menu',
                      'Manage food items and categories',
                      Icons.restaurant_menu,
                      'menu',
                    ),
                    _buildFeatureCard(
                      'Feedback',
                      'Review customer comments and ratings',
                      Icons.feedback,
                      'feedback',
                    ),
                    _buildFeatureCard(
                      'Employees',
                      'Manage staff and schedules',
                      Icons.people,
                      'employees',
                    ),
                  ],
                ),
                
                SizedBox(height: 32),
                
                // Recent reservations
                _buildRecentReservationsCard(recentReservations),
                
                SizedBox(height: 24),
              ],
            ),
          );
        },
      ),
    );
  }
}