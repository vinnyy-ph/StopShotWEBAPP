<?php
// Start a session
session_start();

// Basic configuration
$appName = "StopShot Web App";
$version = "1.0.0";

// Sample function
function greetUser($name = "Guest") {
    return "Welcome to StopShot, $name!";
}

// Process form submission example
$message = "";
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $message = "Form submitted successfully!";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $appName; ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1><?php echo $appName; ?> - v<?php echo $version; ?></h1>
        
        <p><?php echo greetUser(); ?></p>
        
        <?php if ($message): ?>
            <p style="color: green;"><?php echo $message; ?></p>
        <?php endif; ?>
        
        <form method="post" action="">
            <input type="submit" value="Submit Test Form">
        </form>
        
        <h2>PHP Info</h2>
        <p>Current PHP Version: <?php echo phpversion(); ?></p>
        <p>Current time: <?php echo date('Y-m-d H:i:s'); ?></p>
    </div>
</body>
</html>