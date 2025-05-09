import 'package:flutter/material.dart';
import '../models/reservation_model.dart';
import '../models/room_model.dart';
import 'reservation_form_page.dart';

class ReservationDetailPage extends StatelessWidget {
  final Reservation reservation;
  final List<Room> rooms;
  final Function(int, ReservationStatus) onStatusChange;
  final Function(int) onDelete;
  final Function(int, Map<String, dynamic>) onUpdate;

  const ReservationDetailPage({
    Key? key,
    required this.reservation,
    required this.rooms,
    required this.onStatusChange,
    required this.onDelete,
    required this.onUpdate,
  }) : super(key: key);

  // Format date to readable string
  String _formatDate(DateTime date) {
    final months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }

  // Format time to 12-hour format
  String _formatTime(TimeOfDay time) {
    final hour = time.hourOfPeriod == 0 ? 12 : time.hourOfPeriod;
    final period = time.period == DayPeriod.am ? 'AM' : 'PM';
    return '${hour}:${time.minute.toString().padLeft(2, '0')} $period';
  }

  // Get status color
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

  // Display duration in a readable format
  String _formatDuration(String duration) {
    final parts = duration.split(':');
    final hours = int.parse(parts[0]);
    final minutes = int.parse(parts[1]);
    
    if (minutes == 0) {
      return '$hours hour${hours != 1 ? 's' : ''}';
    } else {
      return '$hours hour${hours != 1 ? 's' : ''} $minutes minute${minutes != 1 ? 's' : ''}';
    }
  }

  @override
  Widget build(BuildContext context) {
    final bool canEdit = reservation.status == ReservationStatus.PENDING;
    final bool canDelete = reservation.status == ReservationStatus.PENDING;
    
    return Scaffold(
      backgroundColor: Color(0xFF151515),
      appBar: AppBar(
        title: Text('Reservation Details'),
        backgroundColor: Color(0xFF1E1E1E),
        elevation: 0,
        actions: [
          if (canEdit)
            IconButton(
              icon: Icon(Icons.edit),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ReservationFormPage(
                      rooms: rooms,
                      reservation: reservation,
                      onSave: (data) async {
                        await onUpdate(reservation.id, data);
                        Navigator.pop(context);
                      },
                    ),
                  ),
                );
              },
            ),
          if (canDelete)
            IconButton(
              icon: Icon(Icons.delete),
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    backgroundColor: Color(0xFF262626),
                    title: Text(
                      'Delete Reservation',
                      style: TextStyle(color: Colors.white),
                    ),
                    content: Text(
                      'Are you sure you want to delete this reservation?',
                      style: TextStyle(color: Colors.white70),
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: Text(
                          'Cancel',
                          style: TextStyle(color: Colors.white70),
                        ),
                      ),
                      TextButton(
                        onPressed: () {
                          Navigator.pop(context);
                          onDelete(reservation.id);
                          Navigator.pop(context);
                        },
                        child: Text(
                          'Delete',
                          style: TextStyle(color: Colors.red),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status card
            Card(
              color: Color(0xFF262626),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Reservation #${reservation.id}',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
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
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 16),
            
            // Customer info
            _buildSectionCard(
              'Customer Information',
              [
                _buildInfoRow('Name', reservation.guestName, Icons.person),
                _buildInfoRow('Email', reservation.guestEmail, Icons.email),
                _buildInfoRow('Number of Guests', 
                  '${reservation.numberOfGuests} guest${reservation.numberOfGuests > 1 ? 's' : ''}', Icons.people),
              ],
            ),
            
            SizedBox(height: 16),
            
            // Reservation details
            _buildSectionCard(
              'Reservation Details',
              [
                _buildInfoRow('Date', _formatDate(reservation.reservationDate), Icons.calendar_today),
                _buildInfoRow('Time', _formatTime(reservation.reservationTime), Icons.access_time),
                _buildInfoRow('Duration', _formatDuration(reservation.duration), Icons.hourglass_bottom),
                _buildInfoRow(
                  'Room Type', 
                  reservation.roomType == 'TABLE' ? 'Table' : 'Karaoke Room', 
                  reservation.roomType == 'TABLE' ? Icons.table_bar : Icons.mic
                ),
                if (reservation.room != null)
                  _buildInfoRow('Room', reservation.room!.roomName, Icons.meeting_room),
              ],
            ),
            
            if (reservation.specialRequests.isNotEmpty) ...[
              SizedBox(height: 16),
              
              // Special requests
              _buildSectionCard(
                'Special Requests',
                [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Text(
                      reservation.specialRequests,
                      style: TextStyle(color: Colors.white70),
                    ),
                  ),
                ],
              ),
            ],
            
            SizedBox(height: 16),
            
            // Created/Updated info
            Card(
              color: Color(0xFF262626),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Created: ${_formatDate(reservation.createdAt)}',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Last Updated: ${_formatDate(reservation.updatedAt)}',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 24),
            
            // Action buttons
            if (reservation.status == ReservationStatus.PENDING)
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: Icon(Icons.check_circle),
                      label: Text('Confirm'),
                      onPressed: () {
                        // Check if room is assigned
                        if (reservation.room == null) {
                          // Room assignment needed
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              backgroundColor: Color(0xFF262626),
                              title: Text(
                                'Room Assignment Required',
                                style: TextStyle(color: Colors.white),
                              ),
                              content: Text(
                                'You need to assign a room before confirming this reservation.',
                                style: TextStyle(color: Colors.white70),
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: Text('Cancel', style: TextStyle(color: Colors.white70)),
                                ),
                                TextButton(
                                  onPressed: () {
                                    Navigator.pop(context);
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => ReservationFormPage(
                                          rooms: rooms,
                                          reservation: reservation,
                                          onSave: (data) async {
                                            // Update with room assignment
                                            await onUpdate(reservation.id, data);
                                            // Then change status to confirmed
                                            await onStatusChange(reservation.id, ReservationStatus.CONFIRMED);
                                            Navigator.pop(context);
                                          },
                                        ),
                                      ),
                                    );
                                  },
                                  child: Text(
                                    'Assign Room',
                                    style: TextStyle(color: Color(0xFFD38236)),
                                  ),
                                ),
                              ],
                            ),
                          );
                        } else {
                          // Room already assigned, confirm directly
                          onStatusChange(reservation.id, ReservationStatus.CONFIRMED);
                          Navigator.pop(context);
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: Icon(Icons.cancel),
                      label: Text('Cancel'),
                      onPressed: () {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            backgroundColor: Color(0xFF262626),
                            title: Text(
                              'Cancel Reservation',
                              style: TextStyle(color: Colors.white),
                            ),
                            content: Text(
                              'Are you sure you want to cancel this reservation?',
                              style: TextStyle(color: Colors.white70),
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: Text(
                                  'No',
                                  style: TextStyle(color: Colors.white70),
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.pop(context);
                                  onStatusChange(reservation.id, ReservationStatus.CANCELLED);
                                  Navigator.pop(context);
                                },
                                child: Text(
                                  'Yes, Cancel',
                                  style: TextStyle(color: Colors.red),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionCard(String title, List<Widget> children) {
    return Card(
      color: Color(0xFF262626),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                color: Color(0xFFD38236),
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            SizedBox(height: 16),
            ...children,
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: Color(0xFFD38236).withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: Color(0xFFD38236),
              size: 20,
            ),
          ),
          SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  color: Colors.white54,
                  fontSize: 12,
                ),
              ),
              SizedBox(height: 2),
              Text(
                value,
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}