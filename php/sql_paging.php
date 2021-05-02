<?php

$offset = 0;
$rows = array();

include("config.php");
include("opendb_diro.php");
$result = mysqli_query($conn, "SELECT * FROM " . $db_table_usf_fan . " LIMIT $offset, 10;");

while ($row = mysqli_fetch_assoc($result)) {
    $columns = array();
    $cue = $row['CUE'];
    $target = $row['TARGET'];
    $msg = $row['MSG'];
    array_push($columns, $cue, $target, $msg);
    array_push($rows, $columns);
}

echo json_encode($rows);

mysqli_free_result($result);
include('closedb_diro.php');
