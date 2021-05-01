<?php
// les champs de la base sont connus
include("config_users.php");
include("opendb_diro.php");
$db_email = $_REQUEST["email"];
$db_username = $_REQUEST["username"];
$db_password = $_REQUEST["password"];
if (!filter_var($db_email, FILTER_VALIDATE_EMAIL)) {
    die("$db_email is not a valid email address");
}
$result = mysqli_query($conn, "SELECT EMAIL,USERNAME,PASSWORD,GAMES_PLAYED,SCORE FROM $db_name.$db_table WHERE EMAIL='$db_email';");
if ($range = mysqli_fetch_assoc($result)) {
    var_dump($range);
    echo "EMAIL TAKEN";
} else {
    $user_creation = mysqli_query($conn, "INSERT INTO $db_table(EMAIL,USERNAME,PASSWORD) VALUES ('$db_email','$db_username','$db_password');");
    echo "USER CREATED";
}
include("closedb_diro.php");
