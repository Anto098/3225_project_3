<?php

// les champs de la base sont connus
include("config.php");
include("opendb_diro.php");
$db_cue = $_REQUEST["cue"];
echo "db_cue : $db_cue";
if($db_cue === "") {
    $letter = chr(rand(97,122)); // generates a random lowercase letter
    // todo remove this
    $letter = "z";
    $result = mysqli_query($conn, "SELECT CUE,TARGET,MSG FROM $db_name.$db_table WHERE CUE LIKE'$letter%';");
    var_dump($result);
} else {
    $result = mysqli_query($conn, "SELECT CUE,TARGET,MSG FROM $db_name.$db_table WHERE CUE='$db_cue';");
}
if ($range = mysqli_fetch_assoc($result)) {
    while($range = mysqli_fetch_assoc($result)){
        $data = array("CUE" => $range["CUE"], "TARGET" => $range["TARGET"], "MSG" => $range["MSG"]);
    }
    echo json_encode($data);
    mysqli_free_result($result);
} else {
    echo json_encode(array("CUE" => ""));
}
include("closedb_diro.php");
