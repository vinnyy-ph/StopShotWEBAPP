import 'package:flutter/material.dart';
import '../models/feedback_model.dart';

class FeedbackResponseDialog extends StatefulWidget {
  final FeedbackItem feedback;
  final Function(String) onRespond;

  const FeedbackResponseDialog({
    Key? key,
    required this.feedback,
    required this.onRespond,
  }) : super(key: key);

  @override
  _FeedbackResponseDialogState createState() => _FeedbackResponseDialogState();
}

class _FeedbackResponseDialogState extends State<FeedbackResponseDialog> {
  final TextEditingController _responseController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _responseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // Get available height for proper constraints
    final availableHeight = MediaQuery.of(context).size.height * 0.8;
    
    return Dialog(
      backgroundColor: Color(0xFF1E1E1E),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      // Add constraints to ensure dialog fits properly
      child: ConstrainedBox(
        constraints: BoxConstraints(
          maxHeight: availableHeight,
          minWidth: 300,
        ),
        child: SingleChildScrollView(
          // Make the dialog scrollable
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Dialog header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Respond to Feedback',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.close, color: Colors.white70),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
                Divider(color: Colors.white24),
                SizedBox(height: 10),
                
                // Customer info
                Text(
                  'Customer',
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
                Text(
                  '${widget.feedback.user.firstName} ${widget.feedback.user.lastName}',
                  style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w500),
                ),
                SizedBox(height: 16),
                
                // Rating
                Text(
                  'Rating',
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
                Row(
                  children: [
                    Text(
                      '${widget.feedback.experienceRating} / 5',
                      style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w500),
                    ),
                    SizedBox(width: 8),
                    Row(
                      children: List.generate(
                        5,
                        (index) => Icon(
                          index < widget.feedback.experienceRating ? Icons.star : Icons.star_border,
                          color: Color(0xFFD38236),
                          size: 18,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),
                
                // Feedback text
                Text(
                  'Feedback',
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.black12,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white10),
                  ),
                  padding: EdgeInsets.all(12),
                  margin: EdgeInsets.symmetric(vertical: 8),
                  child: Text(
                    widget.feedback.feedbackText,
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                SizedBox(height: 16),
                
                // Response field
                Text(
                  'Your Response',
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
                SizedBox(height: 8),
                TextField(
                  controller: _responseController,
                  maxLines: 4,
                  style: TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Type your response here...',
                    hintStyle: TextStyle(color: Colors.white30),
                    fillColor: Color(0xFF262626),
                    filled: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(color: Colors.white24),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(color: Color(0xFFD38236), width: 2),
                    ),
                  ),
                ),
                SizedBox(height: 24),
                
                // Action buttons
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    TextButton(
                      onPressed: () => Navigator.of(context).pop(),
                      child: Text(
                        'Cancel',
                        style: TextStyle(color: Colors.white70),
                      ),
                    ),
                    SizedBox(width: 16),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFFD38236),
                        padding: EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 12,
                        ),
                      ),
                      onPressed: _isLoading
                          ? null
                          : () async {
                              if (_responseController.text.isEmpty) return;
                              
                              setState(() {
                                _isLoading = true;
                              });
                              
                              try {
                                await widget.onRespond(_responseController.text);
                                Navigator.of(context).pop();
                              } finally {
                                if (mounted) {
                                  setState(() {
                                    _isLoading = false;
                                  });
                                }
                              }
                            },
                      child: _isLoading
                          ? SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(
                                color: Colors.white,
                                strokeWidth: 2,
                              ),
                            )
                          : Text('Send Response'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}