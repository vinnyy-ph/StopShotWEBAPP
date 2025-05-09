// lib/pages/adminlanding_page.dart
import 'package:flutter/material.dart';

class AdminLandingPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: Text('Admin Dashboard'),
        backgroundColor: const Color.fromARGB(255, 208, 131, 53),
      ),
      body: Center(
        child: Text(
          'Welcome to the Admin Dashboard!',
          style: TextStyle(color: Colors.white, fontSize: 20),
        ),
      ),
    );
  }
}
