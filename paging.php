<?php

include("config-freq.php");
include("opendb-diro.php");
$offset = $_REQUEST["current_offset"];

$result = mysqli_query($conn, "SELECT CUE,TARGET,MSG FROM "
    . $db_name . "." . $db_table . " LIMIT " . "'$offset'" . ", 10;");

$return = array();

while ($row = mysqli_fetch_assoc($result)) {
    $column = array('cue' => $result['CUE'], 'target' => $result['TARGET'], 'msg' => $result['MSG']);
    array_push($return, $column);
}

echo json_encode($return);

mysqli_free_result($result);
include('closedb-diro.php');
