import 'package:flutter/material.dart';
import '../models/feedback_model.dart';
import '../services/feedback_service.dart';
import '../widgets/feedback_response_dialog.dart';

class FeedbackPage extends StatefulWidget {
  @override
  _FeedbackPageState createState() => _FeedbackPageState();
}

class _FeedbackPageState extends State<FeedbackPage> {
  final FeedbackService _feedbackService = FeedbackService();
  late Future<List<FeedbackItem>> _feedbackFuture;
  String _searchQuery = '';
  List<FeedbackItem> _allFeedback = [];
  bool _isLoading = false;
  
  @override
  void initState() {
    super.initState();
    _feedbackFuture = _fetchFeedback();
  }

  Future<List<FeedbackItem>> _fetchFeedback() async {
    setState(() {
      _isLoading = true;
    });
    
    try {
      final feedbackList = await _feedbackService.getFeedback();
      _allFeedback = feedbackList;
      return feedbackList;
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  List<FeedbackItem> get _filteredFeedback {
    if (_searchQuery.isEmpty) return _allFeedback;
    
    return _allFeedback.where((feedback) {
      final userName = '${feedback.user.firstName} ${feedback.user.lastName}'.toLowerCase();
      final userEmail = feedback.user.email.toLowerCase();
      final feedbackText = feedback.feedbackText.toLowerCase();
      final query = _searchQuery.toLowerCase();
      
      return userName.contains(query) || 
             userEmail.contains(query) || 
             feedbackText.contains(query);
    }).toList();
  }

  void _refreshFeedback() {
    setState(() {
      _feedbackFuture = _fetchFeedback();
    });
  }

  Future<void> _respondToFeedback(FeedbackItem feedback, String responseText) async {
    try {
      await _feedbackService.respondToFeedback(feedback.feedbackId, responseText);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Response sent successfully')),
      );
      _refreshFeedback();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to send response: $e'), backgroundColor: Colors.red),
      );
    }
  }

  Future<void> _deleteFeedback(FeedbackItem feedback) async {
    try {
      await _feedbackService.deleteFeedback(feedback.feedbackId);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Feedback deleted successfully')),
      );
      _refreshFeedback();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete feedback: $e'), backgroundColor: Colors.red),
      );
    }
  }

  void _showResponseDialog(FeedbackItem feedback) {
    showDialog(
      context: context,
      builder: (context) => FeedbackResponseDialog(
        feedback: feedback,
        onRespond: (responseText) => _respondToFeedback(feedback, responseText),
      ),
    );
  }

  void _confirmDeleteFeedback(FeedbackItem feedback) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Color(0xFF262626),
        title: Text('Delete Feedback', style: TextStyle(color: Colors.white)),
        content: Text(
          'Are you sure you want to delete this feedback? This action cannot be undone.',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancel', style: TextStyle(color: Colors.white70)),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              _deleteFeedback(feedback);
            },
            child: Text('Delete', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  Widget _buildFeedbackSummary(List<FeedbackItem> feedbacks) {
    // Calculate average rating
    if (feedbacks.isEmpty) return SizedBox.shrink();
    
    final totalRating = feedbacks.fold<int>(0, (sum, feedback) => sum + feedback.experienceRating);
    final averageRating = totalRating / feedbacks.length;
    
    // Count ratings by star
    final Map<int, int> ratingCounts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
    for (var feedback in feedbacks) {
      ratingCounts[feedback.experienceRating] = (ratingCounts[feedback.experienceRating] ?? 0) + 1;
    }
    
    return Card(
      color: Color(0xFF262626),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            // Average rating card
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Average Rating',
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFFAAAAAA),
                    ),
                  ),
                  SizedBox(height: 8),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        averageRating.toStringAsFixed(1),
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(width: 8),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Text(
                          '/ 5',
                          style: TextStyle(
                            fontSize: 16,
                            color: Color(0xFFAAAAAA),
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 4),
                  Row(
                    children: List.generate(
                      5,
                      (index) => Icon(
                        Icons.star,
                        size: 16,
                        color: index < averageRating
                            ? Color(0xFFD38236)
                            : Color(0xFF555555),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            // Divider
            Container(
              height: 80,
              width: 1,
              margin: EdgeInsets.symmetric(horizontal: 16),
              color: Color(0xFF363636),
            ),
            
            // Total reviews card
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Total Reviews',
                    style: TextStyle(
                      fontSize: 14,
                      color: Color(0xFFAAAAAA),
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    feedbacks.length.toString(),
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    '${feedbacks.where((f) => f.responseText == null).length} unanswered',
                    style: TextStyle(
                      fontSize: 14,
                      color: feedbacks.where((f) => f.responseText == null).isNotEmpty
                          ? Colors.orange
                          : Colors.green,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFF151515),
      appBar: AppBar(
        title: Text(
          'Feedback Management',
          style: TextStyle(color: Colors.white), // Ensure text is white
        ),
        backgroundColor: Color(0xFF1E1E1E),
        elevation: 0,
        iconTheme: IconThemeData(color: Colors.white), // This fixes the back arrow color
        actions: [
          IconButton(
            icon: Icon(Icons.refresh, color: Colors.white), // Explicitly set icon color
            onPressed: _refreshFeedback,
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search feedback',
                hintStyle: TextStyle(color: Colors.white54),
                prefixIcon: Icon(Icons.search, color: Colors.white54),
                filled: true,
                fillColor: Color(0xFF262626),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
              style: TextStyle(color: Colors.white),
              cursorColor: Color(0xFFD38236),
              onChanged: (value) {
                setState(() {
                  _searchQuery = value;
                });
              },
            ),
          ),
          
          // Feedback content
          Expanded(
            child: FutureBuilder<List<FeedbackItem>>(
              future: _feedbackFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting && _isLoading) {
                  return Center(
                    child: CircularProgressIndicator(color: Color(0xFFD38236)),
                  );
                }
                
                if (snapshot.hasError) {
                  return Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.error_outline, color: Colors.red, size: 48),
                        SizedBox(height: 16),
                        Text(
                          'Failed to load feedback',
                          style: TextStyle(color: Colors.white),
                        ),
                        SizedBox(height: 8),
                        Text(
                          snapshot.error.toString(),
                          style: TextStyle(color: Colors.white70),
                          textAlign: TextAlign.center,
                        ),
                        SizedBox(height: 16),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(0xFFD38236),
                          ),
                          onPressed: _refreshFeedback,
                          child: Text('Retry'),
                        ),
                      ],
                    ),
                  );
                }
                
                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(
                    child: Text(
                      'No feedback found',
                      style: TextStyle(color: Colors.white70),
                    ),
                  );
                }
                
                final feedbacks = _filteredFeedback;
                
                return RefreshIndicator(
                  onRefresh: () async {
                    _refreshFeedback();
                  },
                  child: ListView(
                    padding: EdgeInsets.all(16),
                    children: [
                      // Summary card
                      _buildFeedbackSummary(feedbacks),
                      SizedBox(height: 16),
                      
                      // Feedback items
                      ...feedbacks.map((feedback) => Card(
                        margin: EdgeInsets.only(bottom: 16),
                        color: Color(0xFF262626),
                        elevation: 2,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Header with user info and rating
                              Row(
                                children: [
                                  // Avatar
                                  CircleAvatar(
                                    backgroundColor: Color(0xFFD38236),
                                    child: Text(
                                      feedback.user.firstName.isNotEmpty
                                          ? feedback.user.firstName[0]
                                          : feedback.user.email[0].toUpperCase(),
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                  SizedBox(width: 12),
                                  
                                  // User info
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          '${feedback.user.firstName} ${feedback.user.lastName}',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16,
                                          ),
                                        ),
                                        Text(
                                          feedback.user.email,
                                          style: TextStyle(
                                            color: Colors.white70,
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  
                                  // Rating
                                  Row(
                                    children: [
                                      ...List.generate(
                                        5,
                                        (index) => Icon(
                                          index < feedback.experienceRating
                                              ? Icons.star
                                              : Icons.star_border,
                                          color: Color(0xFFD38236),
                                          size: 16,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              
                              // Date
                              Padding(
                                padding: const EdgeInsets.only(top: 8.0),
                                child: Text(
                                  'Submitted on ${feedback.createdAt.toString().split('.')[0]}',
                                  style: TextStyle(
                                    color: Colors.white54,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                              
                              // Feedback text
                              Container(
                                margin: EdgeInsets.symmetric(vertical: 12),
                                padding: EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Color(0xFF1E1E1E),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: Colors.white12),
                                ),
                                child: Text(
                                  feedback.feedbackText,
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                              
                              // Response section if any
                              if (feedback.responseText != null)
                                Container(
                                  margin: EdgeInsets.only(bottom: 12),
                                  padding: EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Color(0xFFD38236).withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(8),
                                    border: Border.all(
                                      color: Color(0xFFD38236).withOpacity(0.3),
                                    ),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Our Response',
                                        style: TextStyle(
                                          color: Color(0xFFD38236),
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      SizedBox(height: 4),
                                      Text(
                                        feedback.responseText!,
                                        style: TextStyle(color: Colors.white),
                                      ),
                                    ],
                                  ),
                                ),
                              
                              // Action buttons
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  if (feedback.responseText == null)
                                    TextButton.icon(
                                      icon: Icon(
                                        Icons.reply,
                                        color: Color(0xFFD38236),
                                      ),
                                      label: Text(
                                        'Reply',
                                        style: TextStyle(color: Color(0xFFD38236)),
                                      ),
                                      onPressed: () => _showResponseDialog(feedback),
                                    ),
                                  TextButton.icon(
                                    icon: Icon(
                                      Icons.delete_outline,
                                      color: Colors.redAccent,
                                    ),
                                    label: Text(
                                      'Delete',
                                      style: TextStyle(color: Colors.redAccent)),
                                    onPressed: () => _confirmDeleteFeedback(feedback),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      )).toList(),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}