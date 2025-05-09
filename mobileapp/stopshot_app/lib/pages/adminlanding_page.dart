import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class AdminLandingPage extends StatefulWidget {
  @override
  _AdminLandingPageState createState() => _AdminLandingPageState();
}

class _AdminLandingPageState extends State<AdminLandingPage> {
  late Future<List<Map<String, String>>> _data;

  @override
  void initState() {
    super.initState();
    _data = fetchData(); // Call fetchData method here
  }

  Future<List<Map<String, String>>> fetchData() async {
    final response = await http.get(Uri.parse('https://yourapi.com/data'));

    if (response.statusCode == 200) {
      List<dynamic> data = jsonDecode(response.body);
      return data.map((e) => Map<String, String>.from(e)).toList();
    } else {
      throw Exception('Failed to load data');
    }
  }

  // Method to build metric boxes with fixed size
  Widget _buildMetricBox(String title, String value) {
    return Container(
      width: 160, // Fixed width for uniformity
      height: 100, // Fixed height to maintain box size
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color.fromARGB(255, 44, 44, 44),
        borderRadius: BorderRadius.circular(15),
        border: Border.all(
          color: const Color.fromARGB(255, 70, 70, 70),
          width: 1,
        ),
      ),
      child: Column(
        mainAxisAlignment:
            MainAxisAlignment.center, // Center the content vertically
        crossAxisAlignment:
            CrossAxisAlignment.center, // Center the content horizontally
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          SizedBox(height: 5),
          Text(
            title,
            style: TextStyle(
              fontSize: 14,
              color: Color.fromARGB(255, 150, 150, 150),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 17, 17, 17),
      appBar: AppBar(
        title: Text('StopShot Admin'),
        backgroundColor: const Color.fromARGB(255, 208, 131, 53),
        actions: [
          TextButton.icon(
            onPressed: () {
              Navigator.pop(context);
            },
            icon: Icon(
              Icons.exit_to_app,
              color: Color.fromARGB(255, 17, 17, 17),
            ),
            label: Text(
              'Logout',
              style: TextStyle(color: Color.fromARGB(255, 17, 17, 17)),
            ),
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: SingleChildScrollView(
            child: Column(
              children: [
                // Add a SizedBox here for space between the title bar and the first container
                SizedBox(
                  height: 20,
                ), // Adjust this value for desired distance from the title bar
                // First container for Metrics
                Container(
                  padding: const EdgeInsets.symmetric(
                    vertical: 30,
                    horizontal: 30,
                  ),
                  margin: const EdgeInsets.only(bottom: 30),
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
                      // Title for Metrics
                      Padding(
                        padding: const EdgeInsets.only(bottom: 20),
                        child: Text(
                          'Metrics',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Color.fromARGB(255, 208, 131, 53),
                          ),
                        ),
                      ),

                      // Metrics Row (aligned left)
                      Wrap(
                        spacing: 20,
                        runSpacing: 20,
                        children: [
                          _buildMetricBox('Reservations', '120'),
                          _buildMetricBox('Pending', '8'),
                          _buildMetricBox('Cancelled', '5'),
                          _buildMetricBox('Employees', '12'),
                        ],
                      ),
                    ],
                  ),
                ),

                // Second container for "Manage Reservations"
                Container(
                  padding: const EdgeInsets.symmetric(
                    vertical: 40,
                    horizontal: 30,
                  ),
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
                              cursorColor: Color.fromARGB(255, 208, 131, 53),
                              decoration: InputDecoration(
                                hintText: 'Search...',
                                hintStyle: TextStyle(
                                  color: const Color.fromARGB(
                                    255,
                                    105,
                                    105,
                                    105,
                                  ),
                                ),
                                floatingLabelStyle: TextStyle(
                                  color: Color.fromARGB(
                                    255,
                                    208,
                                    131,
                                    53,
                                  ), // ← label color when focused
                                ),
                                prefixIcon: Icon(
                                  Icons.search,
                                  color: Color.fromARGB(255, 105, 105, 105),
                                ),
                                filled: true,
                                fillColor: Color.fromARGB(255, 44, 44, 44),
                                focusedBorder: OutlineInputBorder(
                                  borderSide: BorderSide(
                                    color: Color.fromARGB(
                                      255,
                                      208,
                                      131,
                                      53,
                                    ), // Set to your desired color
                                    width: 2,
                                  ),
                                ),
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
                      SizedBox(height: 30),
                      // Table with FutureBuilder to load data
                      FutureBuilder<List<Map<String, String>>>(
                        future: _data,
                        builder: (context, snapshot) {
                          if (snapshot.connectionState ==
                              ConnectionState.waiting) {
                            return Center(child: CircularProgressIndicator());
                          }
                          if (snapshot.hasError) {
                            return Center(
                              child: Text('Error: ${snapshot.error}'),
                            );
                          }
                          if (!snapshot.hasData || snapshot.data!.isEmpty) {
                            return Center(child: Text('No data available'));
                          }

                          List<Map<String, String>> tableData = snapshot.data!;

                          return Table(
                            border: TableBorder.all(
                              color: Colors.white,
                              width: 1,
                            ),
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
                              // Dynamically generate rows
                              ...tableData.map((data) {
                                return TableRow(
                                  children: [
                                    TableCell(
                                      child: Padding(
                                        padding: const EdgeInsets.all(12.0),
                                        child: Text(
                                          data['column1'] ?? '',
                                          style: TextStyle(color: Colors.white),
                                        ),
                                      ),
                                    ),
                                    TableCell(
                                      child: Padding(
                                        padding: const EdgeInsets.all(12.0),
                                        child: Text(
                                          data['column2'] ?? '',
                                          style: TextStyle(color: Colors.white),
                                        ),
                                      ),
                                    ),
                                    TableCell(
                                      child: Padding(
                                        padding: const EdgeInsets.all(12.0),
                                        child: Text(
                                          data['column3'] ?? '',
                                          style: TextStyle(color: Colors.white),
                                        ),
                                      ),
                                    ),
                                  ],
                                );
                              }).toList(),
                            ],
                          );
                        },
                      ),
                      SizedBox(height: 30),
                      // Buttons at the bottom-right
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          ElevatedButton(
                            onPressed: () {
                              // Confirm reservation functionality
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color.fromARGB(
                                255,
                                208,
                                131,
                                53,
                              ),
                              foregroundColor: Color.fromARGB(
                                255,
                                255,
                                255,
                                255,
                              ),
                              padding: EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 15,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: Text('Confirm Reservation'),
                          ),
                          SizedBox(width: 10),
                          ElevatedButton(
                            onPressed: () {
                              // Cancel reservation functionality
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Color.fromARGB(255, 180, 80, 40),
                              foregroundColor: Color.fromARGB(
                                255,
                                255,
                                255,
                                255,
                              ),
                              padding: EdgeInsets.symmetric(
                                horizontal: 20,
                                vertical: 15,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: Text('Cancel Reservation'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // Third container (empty for future use)
                SizedBox(height: 30), // Added spacing
                Container(
                  padding: const EdgeInsets.symmetric(
                    vertical: 30,
                    horizontal: 30,
                  ),
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
                      // Title for the third container (for future use)
                      Padding(
                        padding: const EdgeInsets.only(bottom: 20),
                        child: Text(
                          'Extra Container',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: Color.fromARGB(255, 208, 131, 53),
                          ),
                        ),
                      ),
                      // Empty content for now
                      SizedBox(height: 30),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
