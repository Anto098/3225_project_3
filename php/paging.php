<?php

$offset = 0;
$rows = array();

include("config-freq.php");
include("opendb-diro.php");
$result = mysqli_query($conn, "SELECT * FROM " . $db_table . " LIMIT $offset, 10;");

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
include('closedb-diro.php');
