<?php

// les champs de la base sont connus
include("config.php");
include("opendb_diro.php");

$top_result = mysqli_query($conn, "SELECT USERNAME,SCORE FROM $db_name.$db_table_users ORDER BY SCORE DESC LIMIT 10;");

$target_data = array();
while($row = mysqli_fetch_assoc($top_result)) {
    array_push($target_data, $row);
}

if(isset($target_data)) {
    echo json_encode($target_data);
} else {
    echo json_encode(array());
}

mysqli_free_result($top_result);
include("closedb_diro.php");
