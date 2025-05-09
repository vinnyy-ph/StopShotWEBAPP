import 'package:flutter/material.dart';

import 'package:flutter/material.dart';

class AdminLandingPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 17, 17, 17),
      appBar: AppBar(
        title: Text('StopShot Admin'),
        backgroundColor: const Color.fromARGB(255, 208, 131, 53),
        actions: [
          IconButton(
            icon: Icon(Icons.exit_to_app),
            onPressed: () {
              // This will pop the current screen (Admin Landing Page) off the navigation stack
              Navigator.pop(context);
            },
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: SingleChildScrollView(
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 30),
              decoration: BoxDecoration(
                color: const Color.fromARGB(255, 26, 26, 26),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: const Color.fromARGB(255, 48, 48, 48),
                  width: 2,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title and search bar
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Manage Reservations',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Color.fromARGB(255, 208, 131, 53),
                        ),
                      ),
                      // Search bar
                      Container(
                        width: 250,
                        child: TextField(
                          decoration: InputDecoration(
                            hintText: 'Search...',
                            hintStyle: TextStyle(
                              color: const Color.fromARGB(255, 105, 105, 105),
                            ),
                            prefixIcon: Icon(
                              Icons.search,
                              color: Color.fromARGB(255, 105, 105, 105),
                            ),
                            filled: true,
                            fillColor: Color.fromARGB(255, 44, 44, 44),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(10),
                              borderSide: BorderSide.none,
                            ),
                          ),
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(
                    height: 30,
                  ), // Added space between title/search bar and table
                  // Table inside the container
                  Table(
                    children: [
                      TableRow(
                        children: [
                          TableCell(
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Text(
                                'Column 1',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          TableCell(
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Text(
                                'Column 2',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          TableCell(
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Text(
                                'Column 3',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      TableRow(
                        children: [
                          TableCell(
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Text(
                                'Row 1 Data 1',
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                          TableCell(
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Text(
                                'Row 1 Data 2',
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                          TableCell(
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Text(
                                'Row 1 Data 3',
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                        ],
                      ),
                      TableRow(
                        children: [
                          TableCell(
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Text(
                                'Row 2 Data 1',
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                          TableCell(
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Text(
                                'Row 2 Data 2',
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                          TableCell(
                            child: Padding(
                              padding: const EdgeInsets.all(12.0),
                              child: Text(
                                'Row 2 Data 3',
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(height: 30), // Added space between table and buttons
                  // Buttons at the bottom-right
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      ElevatedButton(
                        onPressed: () {
                          // Add your confirm reservation functionality here
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color.fromARGB(
                            255,
                            208,
                            131,
                            53,
                          ), // Confirm reservation button color
                          foregroundColor: Color.fromARGB(255, 255, 255, 255),
                          padding: EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 15,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(
                              10,
                            ), // Set border radius here
                          ),
                        ),
                        child: Text('Confirm Reservation'),
                      ),
                      SizedBox(width: 10), // Space between the buttons
                      ElevatedButton(
                        onPressed: () {
                          // Add your cancel reservation functionality here
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color.fromARGB(
                            255,
                            180,
                            80,
                            40,
                          ), // Cancel reservation button color
                          foregroundColor: Color.fromARGB(255, 255, 255, 255),
                          padding: EdgeInsets.symmetric(
                            horizontal: 20,
                            vertical: 15,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(
                              10,
                            ), // Set border radius here
                          ),
                        ),
                        child: Text('Cancel Reservation'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
