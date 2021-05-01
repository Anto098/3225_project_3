<?php

include("opendb-diro.php");

mysqli_close($conn) or die("Problème lors de la fermeture de la connection ". msqli_error());