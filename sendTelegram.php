<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only POST allowed']);
    exit;
}

$botToken = '7975014617:AAElGXu2Fj59MQ82FsILv4MN4J4jtwlGN1k';
$chatId = '6445039270';

$depart = htmlspecialchars($_POST['adresse_depart'] ?? 'Non spécifié');
$arrivee = htmlspecialchars($_POST['adresse'] ?? 'Non spécifié');
$courseTime = htmlspecialchars($_POST['course-time'] ?? 'Non spécifié');
$date = htmlspecialchars($_POST['pick_date'] ?? 'Non spécifié');
$time = htmlspecialchars($_POST['pick_time'] ?? 'Non spécifié');
$phone = htmlspecialchars($_POST['phone'] ?? 'Non spécifié');

$message = "
🚖 Nouvelle Réservation :
📍 Départ : $depart
📍 Arrivée : $arrivee
🕒 Quand : " . ($courseTime === 'now' ? 'Maintenant' : 'Plus tard') . "
📅 Date : $date
⏰ Heure : $time
📞 Téléphone : $phone
";

$url = "https://api.telegram.org/bot$botToken/sendMessage";

$postFields = [
    'chat_id' => $chatId,
    'text' => $message,
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);

if ($result !== false) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
