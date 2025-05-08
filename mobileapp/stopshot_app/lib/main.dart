import 'package:flutter/material.dart';

void main() {
  runApp(StopShotApp());
}

class StopShotApp extends StatefulWidget {
  @override
  _StopShotAppState createState() => _StopShotAppState();
}

class _StopShotAppState extends State<StopShotApp> {
  ScrollController _scrollController = ScrollController();
  String _reservationType = "Table";
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _numberOfGuestsController = TextEditingController();

  final GlobalKey _reservationKey = GlobalKey();

  void _scrollToNext() {
    _scrollController.animateTo(
      MediaQuery.of(context).size.height,
      duration: Duration(seconds: 1),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Scaffold(
        body: SafeArea(
          child: SingleChildScrollView(
            controller: _scrollController,
            child: Column(
              children: [
                // 🔶 First screen (Orange section)
                Container(
                  height: MediaQuery.of(context).size.height,
                  color: const Color.fromARGB(255, 26, 26, 26),
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'STOPSHOT',
                          style: TextStyle(
                            fontFamily: 'Montserrat',
                            fontSize: 40,
                            fontWeight: FontWeight.w900,
                            color: const Color.fromARGB(255, 255, 164, 28),
                            letterSpacing: 2,
                          ),
                        ),
                        SizedBox(height: 40),
                        ElevatedButton(
                          onPressed: _scrollToNext,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color.fromARGB(255, 26, 26, 26),
                            foregroundColor: const Color.fromARGB(255, 255, 164, 28),
                            padding: EdgeInsets.symmetric(horizontal: 40, vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            textStyle: TextStyle(
                              fontFamily: 'Montserrat',
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                          child: Text('Start'),
                        ),
                      ],
                    ),
                  ),
                ),

                // ⚪ Second screen (Menu section)
                Container(
                  height: MediaQuery.of(context).size.height,
                  color: Colors.white,
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Menu',
                          style: TextStyle(
                            fontFamily: 'Montserrat',
                            fontSize: 30,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                          ),
                        ),
                        SizedBox(height: 20),
                        Padding(
                          padding: const EdgeInsets.all(20.0),
                          child: GridView.builder(
                            shrinkWrap: true,
                            physics: NeverScrollableScrollPhysics(),
                            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 3,
                              crossAxisSpacing: 10,
                              mainAxisSpacing: 10,
                            ),
                            itemCount: 9,
                            itemBuilder: (context, index) {
                              return Container(
                                color: Colors.grey[300],
                                child: Center(
                                  child: Text(
                                    'Item ${index + 1}',
                                    style: TextStyle(
                                      fontFamily: 'Montserrat',
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                        SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: () {
                            Scrollable.ensureVisible(
                              _reservationKey.currentContext!,
                              duration: Duration(seconds: 1),
                              curve: Curves.easeInOut,
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color.fromARGB(255, 26, 26, 26),
                            foregroundColor: const Color.fromARGB(255, 255, 164, 28),
                            padding: EdgeInsets.symmetric(horizontal: 40, vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            textStyle: TextStyle(
                              fontFamily: 'Montserrat',
                              fontWeight: FontWeight.bold,
                              fontSize: 18,
                            ),
                          ),
                          child: Text('Make Reservation'),
                        ),
                      ],
                    ),
                  ),
                ),

                // 📅 Reservation Section
                KeyedSubtree(
                  key: _reservationKey,
                  child: Container(
                    height: MediaQuery.of(context).size.height,
                    color: const Color.fromARGB(255, 34, 34, 34),
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 50),
                    child: Center(
                      child: SingleChildScrollView(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Make a Reservation',
                              style: TextStyle(
                                fontFamily: 'Montserrat',
                                fontSize: 30,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            SizedBox(height: 20),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                ElevatedButton(
                                  onPressed: () {
                                    setState(() {
                                      _reservationType = "Table";
                                    });
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: _reservationType == "Table"
                                        ? const Color.fromARGB(255, 255, 164, 28)
                                        : const Color.fromARGB(255, 26, 26, 26),
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                  ),
                                  child: Text('Table'),
                                ),
                                SizedBox(width: 10),
                                ElevatedButton(
                                  onPressed: () {
                                    setState(() {
                                      _reservationType = "KTV Room";
                                    });
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: _reservationType == "KTV Room"
                                        ? const Color.fromARGB(255, 255, 164, 28)
                                        : const Color.fromARGB(255, 26, 26, 26),
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                  ),
                                  child: Text('KTV Room'),
                                ),
                              ],
                            ),
                            SizedBox(height: 20),
                            TextField(
                              controller: _numberOfGuestsController,
                              keyboardType: TextInputType.number,
                              decoration: InputDecoration(
                                labelText: 'Number of Guests',
                                border: OutlineInputBorder(),
                                filled: true,
                                fillColor: Colors.grey[700],
                                labelStyle: TextStyle(color: Colors.white),
                              ),
                              style: TextStyle(color: Colors.white),
                            ),
                            SizedBox(height: 20),
                            TextField(
                              controller: _nameController,
                              decoration: InputDecoration(
                                labelText: 'Your Name',
                                border: OutlineInputBorder(),
                                filled: true,
                                fillColor: Colors.grey[700],
                                labelStyle: TextStyle(color: Colors.white),
                              ),
                              style: TextStyle(color: Colors.white),
                            ),
                            SizedBox(height: 20),
                            TextField(
                              controller: _emailController,
                              decoration: InputDecoration(
                                labelText: 'Your Email',
                                border: OutlineInputBorder(),
                                filled: true,
                                fillColor: Colors.grey[700],
                                labelStyle: TextStyle(color: Colors.white),
                              ),
                              style: TextStyle(color: Colors.white),
                            ),
                            SizedBox(height: 20),
                            ElevatedButton(
                              onPressed: () {
                                print("Reservation for $_reservationType confirmed.");
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color.fromARGB(255, 255, 164, 28),
                                foregroundColor: const Color.fromARGB(255, 32, 32, 32),
                                padding: EdgeInsets.symmetric(horizontal: 40, vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                textStyle: TextStyle(
                                  fontFamily: 'Montserrat',
                                  fontWeight: FontWeight.bold,
                                  fontSize: 18,
                                ),
                              ),
                              child: Text('Confirm Reservation'),
                            ),
                          ],
                        ),
                      ),
                    ),
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
