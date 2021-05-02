<?php

// les champs de la base sont connus
include("config.php");
include("opendb_diro.php");
$db_email = $_REQUEST["email"];
$db_password = $_REQUEST["password"];

if(!filter_var($db_email, FILTER_VALIDATE_EMAIL)){
    exit("$db_email is not a valid email address");
}

$result = mysqli_query($conn, "SELECT EMAIL,USERNAME,PASSWORD,GAMES_PLAYED,SCORE FROM $db_name.$db_table_users WHERE EMAIL='$db_email';");

if ($range = mysqli_fetch_assoc($result)) {
    $data = array("EMAIL" => $range["EMAIL"], "PASSWORD" => $range["PASSWORD"], "USERNAME" => $range["USERNAME"]);
    echo json_encode($data);
    mysqli_free_result($result);
} else {
    echo json_encode(array());
}
include("closedb_diro.php");
