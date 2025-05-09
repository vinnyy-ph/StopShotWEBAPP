import 'package:flutter/material.dart';
import '../models/reservation_model.dart';
import '../models/room_model.dart';

class ReservationFormPage extends StatefulWidget {
  final List<Room> rooms;
  final Reservation? reservation;
  final Function(Map<String, dynamic>) onSave;

  const ReservationFormPage({
    Key? key,
    required this.rooms,
    this.reservation,
    required this.onSave,
  }) : super(key: key);

  @override
  _ReservationFormPageState createState() => _ReservationFormPageState();
}

class _ReservationFormPageState extends State<ReservationFormPage> {
  final _formKey = GlobalKey<FormState>();
  
  late TextEditingController _guestNameController;
  late TextEditingController _guestEmailController;
  late TextEditingController _numberOfGuestsController;
  late TextEditingController _specialRequestsController;
  
  DateTime _reservationDate = DateTime.now();
  TimeOfDay _reservationTime = TimeOfDay(hour: 16, minute: 0); // Default 4:00 PM
  
  String _selectedDuration = '01:00:00'; // Default 1 hour
  String? _selectedRoomId;
  String _selectedRoomType = 'TABLE'; // Default table
  String _selectedStatus = 'PENDING';
  
  bool _isEdit = false;
  bool _isLoading = false;
  bool _canEditGuestInfo = true;
  
  @override
  void initState() {
    super.initState();
    
    _isEdit = widget.reservation != null;
    
    // Initialize controllers with values if editing
    _guestNameController = TextEditingController(
      text: widget.reservation?.guestName ?? '',
    );
    
    _guestEmailController = TextEditingController(
      text: widget.reservation?.guestEmail ?? '',
    );
    
    _numberOfGuestsController = TextEditingController(
      text: widget.reservation?.numberOfGuests.toString() ?? '1',
    );
    
    _specialRequestsController = TextEditingController(
      text: widget.reservation?.specialRequests ?? '',
    );
    
    if (_isEdit) {
      // Set date, time
      _reservationDate = widget.reservation!.reservationDate;
      _reservationTime = widget.reservation!.reservationTime;
      
      // Set duration
      _selectedDuration = widget.reservation!.duration;
      
      // Set room type - standardize format
      String roomType = widget.reservation!.roomType;
      if (roomType == "Karaoke Room" || roomType.toUpperCase() == "KARAOKE_ROOM") {
        _selectedRoomType = 'KARAOKE_ROOM';
      } else if (roomType == "Table" || roomType.toUpperCase() == "TABLE") {
        _selectedRoomType = 'TABLE';
      }
      
      // Set room id if assigned
      _selectedRoomId = widget.reservation!.room?.id.toString();
      
      // Set status
      switch (widget.reservation!.status) {
        case ReservationStatus.CONFIRMED:
          _selectedStatus = 'CONFIRMED';
          break;
        case ReservationStatus.CANCELLED:
          _selectedStatus = 'CANCELLED';
          break;
        default:
          _selectedStatus = 'PENDING';
      }
      
      // In edit mode, guest info can't be changed
      _canEditGuestInfo = false;
    }
  }
  
  @override
  void dispose() {
    _guestNameController.dispose();
    _guestEmailController.dispose();
    _numberOfGuestsController.dispose();
    _specialRequestsController.dispose();
    super.dispose();
  }
  
  // Select date
  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _reservationDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(Duration(days: 365)),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: ColorScheme.dark(
              primary: Color(0xFFD38236),
              onPrimary: Colors.white,
              surface: Color(0xFF262626),
              onSurface: Colors.white,
            ),
            dialogBackgroundColor: Color(0xFF1E1E1E),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != _reservationDate) {
      setState(() {
        _reservationDate = picked;
      });
    }
  }
  
  // Select time
  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _reservationTime,
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: ColorScheme.dark(
              primary: Color(0xFFD38236),
              onPrimary: Colors.white,
              surface: Color(0xFF262626),
              onSurface: Colors.white,
            ),
            dialogBackgroundColor: Color(0xFF1E1E1E),
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != _reservationTime) {
      setState(() {
        _reservationTime = picked;
      });
    }
  }
  
  // Format time to readable string
  String _formatTime(TimeOfDay time) {
    final hour = time.hourOfPeriod == 0 ? 12 : time.hourOfPeriod;
    final period = time.period == DayPeriod.am ? 'AM' : 'PM';
    return '${hour}:${time.minute.toString().padLeft(2, '0')} $period';
  }
  
  // Save form
  void _saveForm() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });
      
      // For showing a dialog if confirming without room
      bool isSettingConfirmedWithoutRoom = _selectedStatus == 'CONFIRMED' && _selectedRoomId == null;
      
      if (isSettingConfirmedWithoutRoom) {
        setState(() {
          _isLoading = false;
        });
        
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            backgroundColor: Color(0xFF262626),
            title: Text(
              'Room Required',
              style: TextStyle(color: Colors.white),
            ),
            content: Text(
              'A reservation must have a room assigned before it can be confirmed.',
              style: TextStyle(color: Colors.white70),
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text('OK', style: TextStyle(color: Color(0xFFD38236))),
              ),
            ],
          ),
        );
        
        return;
      }
      
      // Format time
      String formatTimeToString(TimeOfDay time) {
        return '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}:00';
      }
      
      // Create data object
      final Map<String, dynamic> reservationData = {
        'guest_name': _guestNameController.text,
        'guest_email': _guestEmailController.text,
        'reservation_date': _reservationDate.toIso8601String().split('T')[0],
        'reservation_time': formatTimeToString(_reservationTime),
        'duration': _selectedDuration,
        'number_of_guests': int.parse(_numberOfGuestsController.text),
        'special_requests': _specialRequestsController.text,
        'status': _selectedStatus,
        'room_type': _selectedRoomType, // Use the raw enum value as expected by the API
      };
      
      // Add room_id if selected
      if (_selectedRoomId != null) {
        reservationData['room_id'] = int.parse(_selectedRoomId!);
      }
      
      // Add ID if editing
      if (_isEdit && widget.reservation != null) {
        reservationData['id'] = widget.reservation!.id;
      }
      
      // Call save function
      widget.onSave(reservationData).then((_) {
        setState(() {
          _isLoading = false;
        });
        
        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              _isEdit ? 'Reservation updated successfully' : 'Reservation created successfully',
              style: TextStyle(color: Colors.white),
            ),
            backgroundColor: Colors.green,
          ),
        );
        
        Navigator.pop(context);
      }).catchError((error) {
        setState(() {
          _isLoading = false;
        });
        
        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Error: $error',
              style: TextStyle(color: Colors.white),
            ),
            backgroundColor: Colors.red,
          ),
        );
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    // Get rooms filtered by selected room type
    List<Room> filteredRooms = widget.rooms.where((room) {
      // Handle different formats of room type
      String roomTypeStr = room.roomTypeToString(room.roomType);
      if (_selectedRoomType == 'KARAOKE_ROOM') {
        return roomTypeStr == 'KARAOKE_ROOM' || roomTypeStr == 'Karaoke Room';
      } else if (_selectedRoomType == 'TABLE') {
        return roomTypeStr == 'TABLE' || roomTypeStr == 'Table';
      }
      return false;
    }).toList();
    
    return Scaffold(
      backgroundColor: Color(0xFF151515),
      appBar: AppBar(
        title: Text(
          _isEdit ? 'Edit Reservation' : 'New Reservation',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Color(0xFF1E1E1E),
        elevation: 0,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator(color: Color(0xFFD38236)))
          : SingleChildScrollView(
              padding: EdgeInsets.all(16),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Guest Information
                    _buildSectionTitle('Guest Information'),
                    
                    // Guest Name
                    TextFormField(
                      controller: _guestNameController,
                      enabled: !_isEdit,
                      style: TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        labelText: 'Guest Name',
                        labelStyle: TextStyle(color: Colors.white70),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: Colors.white30),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: Color(0xFFD38236)),
                        ),
                        filled: true,
                        fillColor: Color(0xFF262626),
                        prefixIcon: Icon(Icons.person, color: Color(0xFFD38236)),
                        helperText: _isEdit ? 'Guest name cannot be changed' : null,
                        helperStyle: TextStyle(color: Colors.white38),
                      ),
                      validator: (value) {
                        if (!_canEditGuestInfo) return null;
                        if (value == null || value.isEmpty) {
                          return 'Please enter guest name';
                        }
                        return null;
                      },
                    ),
                    
                    SizedBox(height: 16),
                    
                    // Guest Email
                    TextFormField(
                      controller: _guestEmailController,
                      enabled: !_isEdit,
                      style: TextStyle(color: Colors.white),
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        labelText: 'Email',
                        labelStyle: TextStyle(color: Colors.white70),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: Colors.white30),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: Color(0xFFD38236)),
                        ),
                        filled: true,
                        fillColor: Color(0xFF262626),
                        prefixIcon: Icon(Icons.email, color: Color(0xFFD38236)),
                        helperText: _isEdit ? 'Email cannot be changed' : null,
                        helperStyle: TextStyle(color: Colors.white38),
                      ),
                      validator: (value) {
                        if (!_canEditGuestInfo) return null;
                        if (value == null || value.isEmpty) {
                          return 'Please enter email';
                        }
                        // Basic email validation
                        if (!value.contains('@') || !value.contains('.')) {
                          return 'Please enter a valid email';
                        }
                        return null;
                      },
                    ),
                    
                    SizedBox(height: 16),
                    
                    // Number of Guests
                    TextFormField(
                      controller: _numberOfGuestsController,
                      style: TextStyle(color: Colors.white),
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        labelText: 'Number of Guests',
                        labelStyle: TextStyle(color: Colors.white70),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: Colors.white30),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: Color(0xFFD38236)),
                        ),
                        filled: true,
                        fillColor: Color(0xFF262626),
                        prefixIcon: Icon(Icons.people, color: Color(0xFFD38236)),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter number of guests';
                        }
                        final number = int.tryParse(value);
                        if (number == null || number < 1) {
                          return 'Number of guests must be at least 1';
                        }
                        return null;
                      },
                    ),
                    
                    SizedBox(height: 24),
                    
                    // Reservation Details
                    _buildSectionTitle('Reservation Details'),
                    
                    // Date and Time Selection
                    Row(
                      children: [
                        // Date Picker
                        Expanded(
                          child: GestureDetector(
                            onTap: () => _selectDate(context),
                            child: Container(
                              padding: EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Color(0xFF262626),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.white30),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Date',
                                    style: TextStyle(color: Colors.white70, fontSize: 12),
                                  ),
                                  SizedBox(height: 4),
                                  Row(
                                    children: [
                                      Icon(Icons.calendar_today, color: Color(0xFFD38236)),
                                      SizedBox(width: 8),
                                      Text(
                                        '${_reservationDate.year}-${_reservationDate.month.toString().padLeft(2, '0')}-${_reservationDate.day.toString().padLeft(2, '0')}',
                                        style: TextStyle(color: Colors.white),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        
                        SizedBox(width: 16),
                        
                        // Time Picker
                        Expanded(
                          child: GestureDetector(
                            onTap: () => _selectTime(context),
                            child: Container(
                              padding: EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Color(0xFF262626),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.white30),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Time',
                                    style: TextStyle(color: Colors.white70, fontSize: 12),
                                  ),
                                  SizedBox(height: 4),
                                  Row(
                                    children: [
                                      Icon(Icons.access_time, color: Color(0xFFD38236)),
                                      SizedBox(width: 8),
                                      Text(
                                        _formatTime(_reservationTime),
                                        style: TextStyle(color: Colors.white),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    
                    SizedBox(height: 16),
                    
                    // Duration Selection
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Duration',
                          style: TextStyle(color: Colors.white70, fontSize: 14),
                        ),
                        SizedBox(height: 8),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: Color(0xFF262626),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.white30),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _selectedDuration,
                              isExpanded: true,
                              dropdownColor: Color(0xFF262626),
                              style: TextStyle(color: Colors.white),
                              icon: Icon(Icons.arrow_drop_down, color: Color(0xFFD38236)),
                              items: [
                                DropdownMenuItem(
                                  value: '01:00:00',
                                  child: Text('1 Hour'),
                                ),
                                DropdownMenuItem(
                                  value: '01:30:00',
                                  child: Text('1.5 Hours'),
                                ),
                                DropdownMenuItem(
                                  value: '02:00:00',
                                  child: Text('2 Hours'),
                                ),
                                DropdownMenuItem(
                                  value: '02:30:00',
                                  child: Text('2.5 Hours'),
                                ),
                                DropdownMenuItem(
                                  value: '03:00:00',
                                  child: Text('3 Hours'),
                                ),
                              ],
                              onChanged: (value) {
                                setState(() {
                                  _selectedDuration = value!;
                                });
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                    
                    SizedBox(height: 24),
                    
                    // Room Assignment
                    _buildSectionTitle('Room Assignment'),
                    
                    // Room Type (non-editable in edit mode)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Room Type',
                          style: TextStyle(color: Colors.white70, fontSize: 14),
                        ),
                        SizedBox(height: 8),
                        
                        // If in edit mode, show non-interactive room type display
                        if (_isEdit)
                          Container(
                            padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                            decoration: BoxDecoration(
                              color: Color(0xFF262626),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.white30),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  _selectedRoomType == 'TABLE' || _selectedRoomType == 'Table' 
                                      ? Icons.table_bar 
                                      : Icons.mic,
                                  color: Color(0xFFD38236),
                                  size: 20,
                                ),
                                SizedBox(width: 12),
                                Text(
                                  _selectedRoomType == 'TABLE' || _selectedRoomType == 'Table' 
                                      ? 'Table' 
                                      : 'Karaoke Room',
                                  style: TextStyle(color: Colors.white),
                                ),
                                Spacer(),
                                Text(
                                  '(Cannot be changed)',
                                  style: TextStyle(color: Colors.white54, fontSize: 12),
                                ),
                              ],
                            ),
                          )
                        // In create mode, allow selection of room type
                        else 
                          Row(
                            children: [
                              Expanded(
                                child: GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _selectedRoomType = 'TABLE';
                                      _selectedRoomId = null; // Reset room selection when type changes
                                    });
                                  },
                                  child: Container(
                                    padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                                    decoration: BoxDecoration(
                                      color: _selectedRoomType == 'TABLE'
                                          ? Color(0xFFD38236).withOpacity(0.2)
                                          : Color(0xFF262626),
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(
                                        color: _selectedRoomType == 'TABLE'
                                            ? Color(0xFFD38236)
                                            : Colors.white30,
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          Icons.table_bar,
                                          color: _selectedRoomType == 'TABLE'
                                              ? Color(0xFFD38236)
                                              : Colors.white54,
                                          size: 16,
                                        ),
                                        SizedBox(width: 4),
                                        Flexible(
                                          child: Text(
                                            'Table',
                                            style: TextStyle(
                                              color: _selectedRoomType == 'TABLE'
                                                  ? Color(0xFFD38236)
                                                  : Colors.white,
                                              fontSize: 14,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                              SizedBox(width: 16),
                              Expanded(
                                child: GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _selectedRoomType = 'KARAOKE_ROOM';
                                      _selectedRoomId = null; // Reset room selection when type changes
                                    });
                                  },
                                  child: Container(
                                    padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                                    decoration: BoxDecoration(
                                      color: _selectedRoomType == 'KARAOKE_ROOM'
                                          ? Color(0xFFD38236).withOpacity(0.2)
                                          : Color(0xFF262626),
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(
                                        color: _selectedRoomType == 'KARAOKE_ROOM'
                                            ? Color(0xFFD38236)
                                            : Colors.white30,
                                      ),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          Icons.mic,
                                          color: _selectedRoomType == 'KARAOKE_ROOM'
                                              ? Color(0xFFD38236)
                                              : Colors.white54,
                                          size: 16,
                                        ),
                                        SizedBox(width: 4),
                                        Flexible(
                                          child: Text(
                                            'Karaoke Room',
                                            style: TextStyle(
                                              color: _selectedRoomType == 'KARAOKE_ROOM'
                                                  ? Color(0xFFD38236)
                                                  : Colors.white,
                                              fontSize: 14,
                                            ),
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                      ],
                    ),
                    
                    SizedBox(height: 16),
                    
                    // Room Selection
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Select Room',
                          style: TextStyle(color: Colors.white70, fontSize: 14),
                        ),
                        SizedBox(height: 8),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: Color(0xFF262626),
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.white30),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String?>(
                              value: _selectedRoomId,
                              isExpanded: true,
                              dropdownColor: Color(0xFF262626),
                              style: TextStyle(color: Colors.white),
                              icon: Icon(Icons.arrow_drop_down, color: Color(0xFFD38236)),
                              hint: Text('Select a room', style: TextStyle(color: Colors.white54)),
                              items: [
                                DropdownMenuItem<String?>(
                                  value: null,
                                  child: Text('No specific room (auto-assign later)'),
                                ),
                                ...filteredRooms
                                    .where((room) => room.roomCanBeBooked) // Only show bookable rooms
                                    .map((room) {
                                  return DropdownMenuItem<String>(
                                    value: room.id.toString(),
                                    child: Text(
                                      '${room.roomName} (Max ${room.maxNumberOfPeople} people)',
                                    ),
                                  );
                                }).toList(),
                              ],
                              onChanged: (value) {
                                setState(() {
                                  _selectedRoomId = value;
                                });
                              },
                            ),
                          ),
                        ),
                      ],
                    ),
                    
                    // Reservation Status (only visible in edit mode)
                    if (_isEdit) ...[
                      SizedBox(height: 24),
                      _buildSectionTitle('Reservation Status'),
                      Row(
                        children: [
                          _buildStatusOption('PENDING', Icons.pending),
                          SizedBox(width: 8),
                          _buildStatusOption('CONFIRMED', Icons.check_circle),
                          SizedBox(width: 8),
                          _buildStatusOption('CANCELLED', Icons.cancel),
                        ],
                      ),
                    ],
                    
                    SizedBox(height: 24),
                    
                    // Special Requests
                    _buildSectionTitle('Special Requests'),
                    TextFormField(
                      controller: _specialRequestsController,
                      style: TextStyle(color: Colors.white),
                      maxLines: 3,
                      decoration: InputDecoration(
                        hintText: 'Any special requests or notes',
                        hintStyle: TextStyle(color: Colors.white38),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: Colors.white30),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(color: Color(0xFFD38236)),
                        ),
                        filled: true,
                        fillColor: Color(0xFF262626),
                      ),
                    ),
                    
                    SizedBox(height: 32),
                    
                    // Submit Button
                    Container(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: _saveForm,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFFD38236),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          textStyle: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        child: Text(_isEdit ? 'Update Reservation' : 'Create Reservation'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
      );
  }
  
  // Helper to build section titles
  Widget _buildSectionTitle(String title) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            color: Color(0xFFD38236),
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        SizedBox(height: 12),
      ],
    );
  }
  
  // Helper to build status selection options
  Widget _buildStatusOption(String status, IconData icon) {
    final bool isSelected = _selectedStatus == status;
    
    Color getStatusColor(String status) {
      switch (status) {
        case 'CONFIRMED':
          return Colors.green;
        case 'PENDING':
          return Colors.orange;
        case 'CANCELLED':
          return Colors.red;
        default:
          return Colors.white;
      }
    }
    
    final statusColor = getStatusColor(status);
    
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedStatus = status;
          });
        },
        child: Container(
          padding: EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: isSelected ? statusColor.withOpacity(0.2) : Color(0xFF262626),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected ? statusColor : Colors.white30,
            ),
          ),
          child: Column(
            children: [
              Icon(
                icon,
                color: isSelected ? statusColor : Colors.white54,
              ),
              SizedBox(height: 4),
              Text(
                status,
                style: TextStyle(
                  color: isSelected ? statusColor : Colors.white,
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Add this helper method to the _ReservationFormPageState class
  String _getRoomTypeDisplayName(String roomTypeValue) {
    switch (roomTypeValue) {
      case 'TABLE':
        return 'Table';
      case 'KARAOKE_ROOM':
        return 'Karaoke Room';
      default:
        return roomTypeValue;
    }
  }
}
