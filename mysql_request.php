<?php

include("config-freq.php");
include("opendb-diro.php");
$result = mysqli_query($conn, "SELECT * FROM " . $db_table . " LIMIT 5;");

echo '<table border="1">';
while ($range = mysqli_fetch_assoc($result)) {
    $word = $range['CUE'];
    $count = $range['TARGET'];
    $msg = $range['MSG'];
    echo "<tr><td>$word</td><td>$count</td><td>$msg</td></tr>";
}
echo '</table>';
mysqli_free_result($result);
include('closedb-diro.php');
