enum RoomType {
  TABLE,
  KARAOKE_ROOM
}

class Room {
  final int id;
  final String roomName;
  final String? roomDescription;
  final bool roomCanBeBooked;
  final int maxNumberOfPeople;
  final RoomType roomType;

  Room({
    required this.id,
    required this.roomName,
    this.roomDescription,
    required this.roomCanBeBooked,
    required this.maxNumberOfPeople,
    required this.roomType,
  });

  factory Room.fromJson(Map<String, dynamic> json) {
    try {
      // Parse room type string into enum
      RoomType parseRoomType(String typeString) {
        switch (typeString.toUpperCase()) {
          case 'TABLE':
            return RoomType.TABLE;
          case 'KARAOKE_ROOM':
            return RoomType.KARAOKE_ROOM;
          default:
            return RoomType.TABLE;
        }
      }

      // Add proper default values for all potentially missing fields
      return Room(
        id: json['id'],
        roomName: json['room_name'] ?? 'Unnamed Room',
        roomDescription: json['room_description'],
        // Fix the null value issue by providing default values
        roomCanBeBooked: json['room_can_be_booked'] ?? true,
        maxNumberOfPeople: json['max_number_of_people'] ?? 
            (json['room_type']?.toUpperCase() == 'KARAOKE_ROOM' ? 10 : 4), // Default based on type
        roomType: parseRoomType(json['room_type']),
      );
    } catch (e) {
      print('Error parsing room data: $e');
      print('Problematic JSON: $json');
      
      // Return a fallback room with minimal data
      return Room(
        id: json['id'] ?? -1,
        roomName: json['room_name'] ?? 'Error Room',
        roomDescription: null,
        roomCanBeBooked: true,
        maxNumberOfPeople: 4,
        roomType: RoomType.TABLE,
      );
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'room_name': roomName,
      'room_description': roomDescription,
      'room_can_be_booked': roomCanBeBooked,
      'max_number_of_people': maxNumberOfPeople,
      'room_type': roomTypeToString(roomType),
    };
  }

  // Convert enum to string - Making this an instance method 
  String roomTypeToString(RoomType type) {
    switch (type) {
      case RoomType.TABLE:
        return 'TABLE';
      case RoomType.KARAOKE_ROOM:
        return 'KARAOKE_ROOM';
    }
  }

  // Get display name for room type
  String get roomTypeDisplay {
    switch (roomType) {
      case RoomType.TABLE:
        return 'Table';
      case RoomType.KARAOKE_ROOM:
        return 'Karaoke Room';
    }
  }
}