<?php

// les champs de la base sont connus
include("config_freq.php");
include("opendb_diro.php");

$word = $_REQUEST['word'];

if (!ctype_alpha($word)) {  // If the word is not made uniquely of letters, we don't process the request (protection against sql injection).
    die("Mot invalide");
}

$result = mysqli_query($conn, "SELECT * FROM $db_table WHERE CUE='$word' ORDER BY MSG DESC");

$data_array = array();
while ($range = mysqli_fetch_assoc($result)) {
    $cue = $range['CUE'];
    $target = $range['TARGET'];
    $msg = $range['MSG'];
    $data_array[] = $word;
    $data_array[] = $target;
    $data_array[] = $msg;
}
echo json_encode($data_array);
mysqli_free_result($result);
include('closedb_diro.php');