import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<Map<String, String>>> fetchData() async {
  final response = await http.get(Uri.parse('https://yourapi.com/data'));

  if (response.statusCode == 200) {
    List<dynamic> data = jsonDecode(response.body);
    return data.map((e) => Map<String, String>.from(e)).toList();
  } else {
    throw Exception('Failed to load data');
  }
}
