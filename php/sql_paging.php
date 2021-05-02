<?php

include("config.php");
include("opendb_diro.php");
$offset = $_REQUEST["offset"];

$result = mysqli_query($conn, "SELECT CUE AS '0', TARGET AS '1', MSG AS '2' FROM $db_name.$db_table LIMIT $offset, 10");

$return = array();

while ($row = mysqli_fetch_assoc($result)) {
    array_push($return, $row);
}

echo json_encode($return);

mysqli_free_result($result);
include('closedb_diro.php');
