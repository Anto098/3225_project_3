<?php

// les champs de la base sont connus
include("config.php");
include("opendb_diro.php");
$db_email = $_REQUEST["email"];
$db_score = $_REQUEST["score"];
$score_data = mysqli_query($conn, "SELECT SCORE FROM $db_name.$db_table_users WHERE EMAIL='$db_email';");
$row = mysqli_fetch_assoc($score_data);
$current_score = $row["SCORE"];

if($db_score > $current_score) {
    $result = mysqli_query($conn, "UPDATE $db_name.$db_table_users SET GAMES_PLAYED=GAMES_PLAYED+1, SCORE=$db_score WHERE EMAIL='$db_email';");
    echo "game nb and score updated";
} else {
    $result = mysqli_query($conn, "UPDATE $db_name.$db_table_users SET GAMES_PLAYED=GAMES_PLAYED+1 WHERE EMAIL='$db_email';");
    echo "game nb updated";
}
mysqli_free_result($score_data);
mysqli_free_result($result);

include("closedb_diro.php");