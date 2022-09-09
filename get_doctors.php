<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$rand = rand(0, 10);
$file = "./doctors.json";
if ($rand < 1) {
    $file = "error.json";
}

$json = file_get_contents($file);
echo $json;

exit;
