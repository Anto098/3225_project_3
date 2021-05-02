<?php
// les champs de la base sont connus
include("config.php");
include("opendb_diro.php");
$db_email = $_REQUEST["email"];
$db_username = $_REQUEST["username"];
$db_password = $_REQUEST["password"];
if (!filter_var($db_email, FILTER_VALIDATE_EMAIL)) {
    die("$db_email is not a valid email address");
}
$result = mysqli_query($conn, "SELECT EMAIL,USERNAME,PASSWORD,GAMES_PLAYED,SCORE FROM $db_name.$db_table_users WHERE EMAIL='$db_email' OR USERNAME='$db_username';");
if ($range = mysqli_fetch_assoc($result)) {
    $data = array("EMAIL" => $range["EMAIL"], "PASSWORD" => $range["PASSWORD"], "USERNAME" => $range["USERNAME"]);
} else {
    $user_creation = mysqli_query($conn, "INSERT INTO $db_table_users(EMAIL,USERNAME,PASSWORD) VALUES ('$db_email','$db_username','$db_password');");
    $data = array("EMAIL" => $user_creation["EMAIL"], "PASSWORD" => $user_creation["PASSWORD"], "USERNAME" => $user_creation["USERNAME"]);
}
echo json_encode($data);
include("closedb_diro.php");
