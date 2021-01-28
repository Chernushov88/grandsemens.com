<?php
$recepient = "zavada.dmitry@gmail.com, GrandSemensSA@gmail.com";
$sitename = "Grand Semens";

$phone = trim($_POST["phone"]);
$name = trim($_POST["name"]);
$location = trim($_POST["location"]);
$date_submitted = date('Y-m-d');
$time_submitted = date("H:i");
$ref = trim($_POST["ref"]);


$arrayMessage = array(
    array(
        'message' => "Имя: ",
        'field' => $name
    ),
    array(
        'message' => 'Телефон: ',
        'field' => $phone
    ),
    array(
        'message' => 'Пришел со страницы: ',
        'field' => $ref
    ),
    array(
        'message' => 'Отправленно со страницы: ',
        'field' => $location
    ),
    array(
        'message' => 'utm_source: ',
        'field' => $utm_source
    ),
    array(
        'message' => 'utm_campaign: ',
        'field' => $utm_campaign
    ),
    array(
        'message' => 'utm_medium: ',
        'field' => $utm_medium
    ),
    array(
        'message' => 'utm_term: ',
        'field' =>  $utm_term
    ),
    array(
        'message' => 'utm_content: ',
        'field' => $utm_content
    ),
);

function reduceMessage($arr, $prefix)
{
    $message = '';
    foreach ($arr as $obj) {
        if ($obj['field']) {
            $message .= $obj['message'] . $obj['field'] . $prefix;
        }
    }
    return $message;
}

$pagetitle = "Заявка на grandsemens.com ";
$messageTB = "‼ $pagetitle ‼\n" . reduceMessage($arrayMessage, "\n");

$messageEmail = reduceMessage($arrayMessage, "<br>");

//SEND MESSAGE TO TELEGRAM
function sendMessage($chatID, $message, $token)
{
    $url = "https://api.telegram.org/" . $token . "/sendMessage?chat_id=" . $chatID;
    $url = $url . "&text=" . urlencode($message);
    $ch = curl_init();
    $optArray = array(CURLOPT_URL => $url, CURLOPT_RETURNTRANSFER => true);
    curl_setopt_array($ch, $optArray);
    $result = curl_exec($ch);
    echo $result;
    curl_close($ch);
}

$token = "bot1043929893:AAE9RHl19_2LGNu1vpHWxlSauqKasktajno";
$chatID = "-1001455387227";
sendMessage($chatID, $messageTB, $token);

// Для отправки HTML-письма должен быть установлен заголовок Content-type
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=urf-8' . "\r\n";

// Дополнительные заголовки
$headers .= 'From: grandsemens.com';

mail($recepient, $pagetitle, $messageEmail, $headers);
