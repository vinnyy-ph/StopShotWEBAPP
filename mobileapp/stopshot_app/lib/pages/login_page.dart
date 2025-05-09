import 'package:flutter/material.dart';
import 'dart:math' as math;
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'adminlanding_page.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> with SingleTickerProviderStateMixin {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  
  bool _isLoading = false;
  bool _isPasswordVisible = false;
  bool _isLocked = false;
  int _lockTimer = 0;
  int _loginAttempts = 0;
  String _errorMessage = '';
  String _infoMessage = '';

  late AnimationController _logoAnimationController;
  late Animation<double> _logoRotationAnimation;

  @override
  void initState() {
    super.initState();
    
    // Setup logo animation
    _logoAnimationController = AnimationController(
      vsync: this,
      duration: Duration(seconds: 10),
    )..repeat();
    
    _logoRotationAnimation = Tween<double>(
      begin: 0,
      end: 2 * math.pi,
    ).animate(_logoAnimationController);
  }

  @override
  void dispose() {
    _logoAnimationController.dispose();
    _usernameController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _startLockTimer() {
    if (_lockTimer > 0) return;
    
    setState(() {
      _isLocked = true;
      _lockTimer = 30; // 30 seconds lockout
    });
    
    _decrementTimer();
  }

  void _decrementTimer() {
    if (_lockTimer > 0) {
      Future.delayed(Duration(seconds: 1), () {
        if (mounted) {
          setState(() {
            _lockTimer--;
          });
          if (_lockTimer > 0) {
            _decrementTimer();
          } else {
            setState(() {
              _isLocked = false;
              _loginAttempts = 0;
            });
          }
        }
      });
    }
  }

  void _showSnackBar(String message, bool isError) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red : Colors.blue,
        duration: Duration(seconds: 4),
        action: SnackBarAction(
          label: 'Dismiss',
          textColor: Colors.white,
          onPressed: () {
            ScaffoldMessenger.of(context).hideCurrentSnackBar();
          },
        ),
      ),
    );
  }

  void _handleForgotPassword() {
    final email = _usernameController.text.trim();
    if (email.isEmpty) {
      _showSnackBar('Please enter your email address first', false);
      return;
    }
    
    // Here you would typically call your API to send a password reset email
    _showSnackBar('Password reset instructions sent to: $email', false);
  }

  Future<void> _handleLogin() async {
    if (_isLocked) return;

    String username = _usernameController.text.trim();
    String password = _passwordController.text.trim();
    
    if (username.isEmpty || password.isEmpty) {
      _showSnackBar('Username and password are required', true);
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = '';
    });

    try {
      // Connect to your Django backend
      final response = await http.post(
        Uri.parse('http://stopshotapp-env-2.eba-8srvpzqc.ap-southeast-2.elasticbeanstalk.com/api/auth/login/'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'username': username,
          'email': username, // Send as both for backend flexibility
          'password': password,
        }),
      ).timeout(Duration(seconds: 10));

      setState(() {
        _isLoading = false;
      });

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final token = data['token'];
        final userRole = data['user']['role'] ?? 'admin';
        
        // Save token to secure storage
        final storage = FlutterSecureStorage();
        await storage.write(key: 'auth_token', value: token);
        await storage.write(key: 'user_role', value: userRole);

        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => AdminLandingPage()),
        );
      } else {
        final errorData = json.decode(response.body);
        final errorMsg = errorData['error'] ?? 'Login failed. Please try again.';
        
        _showSnackBar(errorMsg, true);
        
        setState(() {
          _loginAttempts++;
          if (_loginAttempts >= 3) {
            _startLockTimer();
          }
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
        _loginAttempts++;
      });
      
      _showSnackBar('Connection error. Please try again later.', true);
      
      if (_loginAttempts >= 3) {
        _startLockTimer();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 17, 17, 17),
      body: Stack(
        children: [
          // Background grid pattern
          Positioned.fill(
            child: CustomPaint(
              painter: GridPainter(),
            ),
          ),
          
          // Background animated elements
          ..._buildBackgroundElements(),
          
          // Main content
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
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.3),
                      blurRadius: 24,
                      offset: Offset(0, 8),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // StopShot Logo
                    Container(
                      height: 120,
                      width: double.infinity,
                      margin: EdgeInsets.only(bottom: 20),
                      child: AnimatedBuilder(
                        animation: _logoAnimationController,
                        builder: (context, child) {
                          return Transform.translate(
                            offset: Offset(
                              math.sin(_logoAnimationController.value * 2 * math.pi) * 3,
                              0,
                            ),
                            child: child,
                          );
                        },
                        child: Image.asset(
                          'assets/logo/logo.png',
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                    
                    Text(
                      'Admin Dashboard',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white.withOpacity(0.7),
                      ),
                    ),
                    SizedBox(height: 40),
                    
                    // Username field
                    TextField(
                      controller: _usernameController,
                      decoration: InputDecoration(
                        labelText: 'Email',
                        labelStyle: TextStyle(color: Colors.white70),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(
                            color: Color.fromARGB(255, 208, 131, 53),
                            width: 2,
                          ),
                        ),
                        filled: true,
                        fillColor: const Color.fromARGB(255, 44, 44, 44),
                        prefixIcon: Icon(
                          Icons.person_outline,
                          color: Color.fromARGB(255, 208, 131, 53).withOpacity(0.8),
                        ),
                      ),
                      style: TextStyle(color: Colors.white),
                      cursorColor: Color.fromARGB(255, 208, 131, 53),
                    ),
                    SizedBox(height: 20),
                    
                    // Password field with visibility toggle
                    TextField(
                      controller: _passwordController,
                      obscureText: !_isPasswordVisible,
                      decoration: InputDecoration(
                        labelText: 'Password',
                        labelStyle: TextStyle(color: Colors.white70),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(8),
                          borderSide: BorderSide(
                            color: Color.fromARGB(255, 208, 131, 53),
                            width: 2,
                          ),
                        ),
                        filled: true,
                        fillColor: const Color.fromARGB(255, 44, 44, 44),
                        prefixIcon: Icon(
                          Icons.lock_outline,
                          color: Color.fromARGB(255, 208, 131, 53).withOpacity(0.8),
                        ),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _isPasswordVisible 
                                ? Icons.visibility_off 
                                : Icons.visibility,
                            color: Colors.white54,
                          ),
                          onPressed: () {
                            setState(() {
                              _isPasswordVisible = !_isPasswordVisible;
                            });
                          },
                        ),
                      ),
                      style: TextStyle(color: Colors.white),
                      cursorColor: Color.fromARGB(255, 208, 131, 53),
                    ),
                    SizedBox(height: 30),
                    
                    // Login button or locked message
                    _isLocked
                        ? Container(
                            padding: EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.red.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.red.withOpacity(0.2),
                              ),
                            ),
                            child: Text(
                              'Too many failed attempts. Try again in $_lockTimer seconds',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: Colors.red.withOpacity(0.9),
                                fontSize: 14,
                              ),
                            ),
                          )
                        : Container(
                            width: double.infinity,
                            height: 50,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Color.fromARGB(255, 208, 131, 53),
                                  Color.fromARGB(255, 230, 126, 34),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(10),
                              boxShadow: [
                                BoxShadow(
                                  color: Color.fromARGB(255, 208, 131, 53).withOpacity(0.3),
                                  blurRadius: 8,
                                  offset: Offset(0, 4),
                                ),
                              ],
                            ),
                            child: ElevatedButton(
                              onPressed: _isLoading ? null : _handleLogin,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.transparent,
                                shadowColor: Colors.transparent,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                textStyle: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                  letterSpacing: 1,
                                ),
                              ),
                              child: Text(
                                'SIGN IN',
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                    SizedBox(height: 16),
                    
                    // Forgot password
                    Align(
                      alignment: Alignment.centerRight,
                      child: TextButton(
                        onPressed: _handleForgotPassword,
                        child: Text(
                          'Forgot Password?',
                          style: TextStyle(
                            color: Color.fromARGB(255, 208, 131, 53).withOpacity(0.8),
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Loading overlay
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
  
  List<Widget> _buildBackgroundElements() {
    final random = math.Random();
    return List.generate(
      10,
      (index) => Positioned(
        top: random.nextDouble() * MediaQuery.of(context).size.height,
        left: random.nextDouble() * MediaQuery.of(context).size.width,
        child: Container(
          width: 50 + random.nextDouble() * 30,
          height: 50 + random.nextDouble() * 30,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(100),
            gradient: RadialGradient(
              colors: [
                Color.fromARGB(255, 208, 131, 53).withOpacity(0.1),
                Color.fromARGB(255, 208, 131, 53).withOpacity(0),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// Custom painter for grid background
class GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Color.fromARGB(255, 208, 131, 53).withOpacity(0.1)
      ..strokeWidth = 1;

    // Draw vertical lines
    for (double i = 0; i < size.width; i += 20) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), paint);
    }
    
    // Draw horizontal lines
    for (double i = 0; i < size.height; i += 20) {
      canvas.drawLine(Offset(0, i), Offset(size.width, i), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}