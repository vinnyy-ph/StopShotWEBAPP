import 'package:flutter/material.dart';
import '../models/reservation_model.dart';
import '../models/room_model.dart';
import '../services/reservation_service.dart';
import 'reservation_detail_page.dart';
import 'reservation_form_page.dart';

class ReservationPage extends StatefulWidget {
  @override
  _ReservationPageState createState() => _ReservationPageState();
}

class _ReservationPageState extends State<ReservationPage> with SingleTickerProviderStateMixin {
  final ReservationService _reservationService = ReservationService();
  
  List<Reservation> _reservations = [];
  List<Room> _rooms = [];
  bool _isLoading = true;
  String _errorMessage = '';
  String _searchQuery = '';
  
  late TabController _tabController;
  final List<String> _tabs = ['All', 'Confirmed', 'Pending', 'Cancelled'];
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
    _tabController.addListener(_handleTabChange);
    _loadReservations();
    _loadRooms();
  }
  
  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
  
  void _handleTabChange() {
    if (_tabController.indexIsChanging) {
      _loadReservations();
    }
  }
  
  Future<void> _loadReservations() async {
    if (!mounted) return;
    
    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });
    
    try {
      // Get status filter based on selected tab
      String? statusFilter;
      switch (_tabController.index) {
        case 1:
          statusFilter = 'CONFIRMED';
          break;
        case 2:
          statusFilter = 'PENDING';
          break;
        case 3:
          statusFilter = 'CANCELLED';
          break;
        default:
          statusFilter = null; // All reservations
      }
      
      final reservations = await _reservationService.getReservations(
        status: statusFilter,
        searchQuery: _searchQuery,
      );
      
      if (mounted) {
        setState(() {
          _reservations = reservations;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to load reservations: $e';
          _isLoading = false;
        });
      }
    }
  }
  
  Future<void> _loadRooms() async {
    try {
      final rooms = await _reservationService.getRooms();
      if (mounted) {
        setState(() {
          _rooms = rooms;
        });
      }
    } catch (e) {
      print('Error loading rooms: $e');
      // Show toast or snackbar with the error
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load rooms. Using default settings.'),
            backgroundColor: Colors.orange,
            action: SnackBarAction(
              label: 'Retry',
              onPressed: _loadRooms,
            ),
          ),
        );
        
        // Initialize with empty list to avoid null errors
        setState(() {
          _rooms = [];
        });
      }
    }
  }
  
  void _handleSearch(String query) {
    setState(() {
      _searchQuery = query;
    });
    _loadReservations();
  }
  
  Future<void> _handleRefresh() async {
    await _loadReservations();
  }
  
  void _showReservationDetail(Reservation reservation) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ReservationDetailPage(
          reservation: reservation,
          rooms: _rooms,
          onStatusChange: _handleStatusChange,
          onDelete: _handleDeleteReservation,
          onUpdate: _handleUpdateReservation,
        ),
      ),
    ).then((_) => _loadReservations()); // Refresh after returning
  }
  
  void _showAddReservation() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ReservationFormPage(
          rooms: _rooms,
          onSave: _handleCreateReservation,
        ),
      ),
    ).then((_) => _loadReservations()); // Refresh after returning
  }
  
  Future<void> _handleCreateReservation(Map<String, dynamic> data) async {
    try {
      await _reservationService.createReservation(data);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Reservation created successfully')),
      );
      _loadReservations();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error creating reservation: $e')),
      );
    }
  }
  
  Future<void> _handleUpdateReservation(int id, Map<String, dynamic> data) async {
    try {
      await _reservationService.updateReservation(id, data);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Reservation updated successfully')),
      );
      _loadReservations();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error updating reservation: $e')),
      );
    }
  }
  
  Future<void> _handleStatusChange(int id, ReservationStatus newStatus) async {
    try {
      String statusString;
      switch (newStatus) {
        case ReservationStatus.CONFIRMED:
          statusString = 'CONFIRMED';
          break;
        case ReservationStatus.CANCELLED:
          statusString = 'CANCELLED';
          break;
        default:
          statusString = 'PENDING';
      }
      
      await _reservationService.updateReservationStatus(id, statusString);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Reservation status updated successfully')),
      );
      _loadReservations();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error updating status: $e')),
      );
    }
  }
  
  Future<void> _handleDeleteReservation(int id) async {
    try {
      final success = await _reservationService.deleteReservation(id);
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Reservation deleted successfully')),
        );
        _loadReservations();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to delete reservation')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error deleting reservation: $e')),
      );
    }
  }
  
  // Helper to format time
  String _formatTime(TimeOfDay time) {
    final hour = time.hourOfPeriod == 0 ? 12 : time.hourOfPeriod;
    final period = time.period == DayPeriod.am ? 'AM' : 'PM';
    return '${hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')} $period';
  }
  
  // Get status chip color
  Color _getStatusColor(ReservationStatus status) {
    switch (status) {
      case ReservationStatus.CONFIRMED:
        return Colors.green;
      case ReservationStatus.PENDING:
        return Colors.orange;
      case ReservationStatus.CANCELLED:
        return Colors.red;
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF151515),
      appBar: AppBar(
        title: Text(
          'Reservations',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Color(0xFF1E1E1E),
        elevation: 0,
        bottom: TabBar(
          controller: _tabController,
          tabs: _tabs.map((tab) => Tab(text: tab)).toList(),
          labelColor: Color(0xFFD38236),
          unselectedLabelColor: Colors.white70,
          indicatorColor: Color(0xFFD38236),
        ),
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              onChanged: _handleSearch,
              decoration: InputDecoration(
                hintText: 'Search reservations...',
                prefixIcon: Icon(Icons.search, color: Colors.white54),
                filled: true,
                fillColor: Color(0xFF262626),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                  borderSide: BorderSide(color: Color(0xFFD38236)),
                ),
                hintStyle: TextStyle(color: Colors.white54),
              ),
              style: TextStyle(color: Colors.white),
            ),
          ),
          
          // Reservation list
          Expanded(
            child: _isLoading
                ? Center(
                    child: CircularProgressIndicator(
                      color: Color(0xFFD38236),
                    ),
                  )
                : _errorMessage.isNotEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              _errorMessage,
                              style: TextStyle(color: Colors.red),
                              textAlign: TextAlign.center,
                            ),
                            SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _loadReservations,
                              child: Text('Try Again'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Color(0xFFD38236),
                              ),
                            ),
                          ],
                        ),
                      )
                    : RefreshIndicator(
                        onRefresh: _handleRefresh,
                        color: Color(0xFFD38236),
                        child: _reservations.isEmpty
                            ? Center(
                                child: Text(
                                  'No reservations found',
                                  style: TextStyle(color: Colors.white70),
                                ),
                              )
                            : ListView.builder(
                                itemCount: _reservations.length,
                                padding: EdgeInsets.all(8),
                                itemBuilder: (context, index) {
                                  final reservation = _reservations[index];
                                  return Card(
                                    color: Color(0xFF262626),
                                    elevation: 2,
                                    margin: EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: ListTile(
                                      onTap: () => _showReservationDetail(reservation),
                                      contentPadding: EdgeInsets.all(16),
                                      title: Row(
                                        children: [
                                          Expanded(
                                            child: Text(
                                              reservation.guestName,
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontWeight: FontWeight.bold,
                                                fontSize: 16,
                                              ),
                                            ),
                                          ),
                                          Container(
                                            padding: EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: _getStatusColor(reservation.status).withOpacity(0.2),
                                              border: Border.all(
                                                color: _getStatusColor(reservation.status),
                                                width: 1,
                                              ),
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                            child: Text(
                                              reservation.status.toString().split('.').last,
                                              style: TextStyle(
                                                color: _getStatusColor(reservation.status),
                                                fontWeight: FontWeight.bold,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      subtitle: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          SizedBox(height: 8),
                                          Row(
                                            children: [
                                              Icon(
                                                Icons.event,
                                                color: Color(0xFFD38236),
                                                size: 16,
                                              ),
                                              SizedBox(width: 4),
                                              Text(
                                                '${reservation.reservationDate.toString().split(' ')[0]} at ${_formatTime(reservation.reservationTime)}',
                                                style: TextStyle(color: Colors.white70),
                                              ),
                                            ],
                                          ),
                                          SizedBox(height: 4),
                                          Row(
                                            children: [
                                              Icon(
                                                Icons.people,
                                                color: Color(0xFFD38236),
                                                size: 16,
                                              ),
                                              SizedBox(width: 4),
                                              Text(
                                                '${reservation.numberOfGuests} guests',
                                                style: TextStyle(color: Colors.white70),
                                              ),
                                              SizedBox(width: 16),
                                              Icon(
                                                reservation.roomType == 'TABLE' 
                                                    ? Icons.table_bar 
                                                    : Icons.mic,
                                                color: Color(0xFFD38236),
                                                size: 16,
                                              ),
                                              SizedBox(width: 4),
                                              Text(
                                                reservation.room?.roomName ?? 
                                                  (reservation.roomType == 'TABLE' ? 'Table' : 'Karaoke Room'),
                                                style: TextStyle(color: Colors.white70),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                      ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _showAddReservation,
        backgroundColor: Color(0xFFD38236),
        child: Icon(Icons.add),
      ),
    );
  }
}

