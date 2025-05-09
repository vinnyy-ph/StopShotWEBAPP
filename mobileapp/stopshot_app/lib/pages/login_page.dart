// login_page.dart
import 'package:flutter/material.dart';
import 'adminlanding_page.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false; // ✅ loading state

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 17, 17, 17),
      body: Stack(
        children: [
          Center(
            child: SingleChildScrollView(
              child: Container(
                width: 500,
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
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'STOPSHOT',
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Color.fromARGB(255, 208, 131, 53),
                      ),
                    ),
                    SizedBox(height: 0),
                    Text(
                      'Admin Login',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 40),
                    TextField(
                      controller: _usernameController,
                      decoration: InputDecoration(
                        labelText: 'Username',
                        labelStyle: TextStyle(color: Colors.white70),
                        border: OutlineInputBorder(),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Color.fromARGB(255, 208, 131, 53),
                            width: 2,
                          ),
                        ),
                        filled: true,
                        fillColor: const Color.fromARGB(255, 44, 44, 44),
                      ),
                      style: TextStyle(color: Colors.white),
                      cursorColor: Color.fromARGB(255, 208, 131, 53),
                    ),
                    SizedBox(height: 20),
                    TextField(
                      controller: _passwordController,
                      obscureText: true,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        labelStyle: TextStyle(color: Colors.white70),
                        border: OutlineInputBorder(),
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(
                            color: Color.fromARGB(255, 208, 131, 53),
                            width: 2,
                          ),
                        ),
                        filled: true,
                        fillColor: const Color.fromARGB(255, 44, 44, 44),
                      ),
                      style: TextStyle(color: Colors.white),
                      cursorColor: Color.fromARGB(255, 208, 131, 53),
                    ),
                    SizedBox(height: 30),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed:
                            _isLoading
                                ? null
                                : () async {
                                  setState(() {
                                    _isLoading = true;
                                  });

                                  await Future.delayed(
                                    Duration(seconds: 2),
                                  ); // simulate login delay

                                  String username =
                                      _usernameController.text.trim();
                                  String password =
                                      _passwordController.text.trim();

                                  if (username == 'admin' &&
                                      password == '1234') {
                                    Navigator.pushReplacement(
                                      context,
                                      MaterialPageRoute(
                                        builder:
                                            (context) => AdminLandingPage(),
                                      ),
                                    );
                                  } else {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                        content: Text(
                                          'Invalid username or password',
                                        ),
                                        backgroundColor: Colors.red,
                                      ),
                                    );
                                  }

                                  setState(() {
                                    _isLoading = false;
                                  });
                                },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color.fromARGB(255, 208, 131, 53),
                          foregroundColor: Colors.white,
                          padding: EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                          textStyle: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        child: Text('Login'),
                      ),
                    ),
                    SizedBox(height: 16),
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: () {
                          print("Forgot Password clicked");
                        },
                        child: Text(
                          'Forgot Password?',
                          style: TextStyle(
                            color: Color.fromARGB(255, 208, 131, 53),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Don't have an account? ",
                          style: TextStyle(color: Colors.white70),
                        ),
                        TextButton(
                          onPressed: () {
                            print("Sign-Up clicked");
                          },
                          child: Text(
                            'Sign Up',
                            style: TextStyle(
                              color: Color.fromARGB(255, 208, 131, 53),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // 🔁 Fullscreen loading overlay
          if (_isLoading)
            Container(
              color: Colors.black.withOpacity(0.7),
              child: Center(
                child: CircularProgressIndicator(
                  color: Color.fromARGB(255, 208, 131, 53),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
