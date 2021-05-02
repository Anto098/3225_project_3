<?php

// les champs de la base sont connus
include("config.php");
include("opendb_diro.php");
$db_cue = $_REQUEST["cue"];
if($db_cue === "") {
    // generates a random lowercase letter
    $rand = 0;
    while($rand == 0 || $rand == 120) {
        // char 120 == x, there are no words starting with x in the database.
        $rand = rand(97,122);
    }
    $db_cue = chr($rand);
    $cue_result = mysqli_query($conn, "SELECT CUE FROM $db_name.$db_table_usf_fan GROUP BY CUE HAVING CUE LIKE'$db_cue%' LIMIT 1;");
} else {
    $cue_result = mysqli_query($conn, "SELECT CUE FROM $db_name.$db_table_usf_fan GROUP BY CUE HAVING CUE LIKE'%$db_cue%' LIMIT 1;");
}
$cue_range = mysqli_fetch_assoc($cue_result);
$cue_data = array("CUE" => $cue_range["CUE"]);
$cue = $cue_data["CUE"];
$target_result = mysqli_query($conn, "SELECT CUE,TARGET,MSG FROM $db_name.$db_table_usf_fan WHERE CUE='$cue';");
$target_data = array();
while($row = mysqli_fetch_assoc($target_result)) {
    array_push($target_data,$row);
}
if(isset($target_data)) {
    echo json_encode($target_data);
} else {
    echo json_encode(array());
}
mysqli_free_result($cue_result);
mysqli_free_result($target_result);
mysqli_free_result($result);
include("closedb_diro.php");
