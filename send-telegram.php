<?php
// sendTelegram.php

// Protect your token: never expose this to the frontend
$botToken = '7975014617:AAElGXu2Fj59MQ82FsILv4MN4J4jtwlGN1k';
$chatId = '6445039270';

// Validate and sanitize inputs
function sanitize($data) {
    return htmlspecialchars(trim($data));
}

$depart = sanitize($_POST['adresse_depart'] ?? '');
$arrivee = sanitize($_POST['adresse'] ?? '');
$courseTime = sanitize($_POST['course_time'] ?? '');
$date = sanitize($_POST['pick_date'] ?? 'Non spécifiée');
$time = sanitize($_POST['pick_time'] ?? 'Non spécifiée');
$phone = sanitize($_POST['phone'] ?? '');

if (!$depart || !$arrivee || !$phone) {
    echo json_encode(['status' => 'error', 'message' => 'Champs requis manquants.']);
    exit;
}

$message = "
🚖 Nouvelle Réservation :
📍 Départ : $depart
📍 Arrivée : $arrivee
🕒 Quand : " . ($courseTime === 'now' ? 'Maintenant' : 'Plus tard') . "
📅 Date : $date
⏰ Heure : $time
📞 Téléphone : $phone
";

// Send to Telegram
$url = "https://api.telegram.org/bot$botToken/sendMessage";
$params = [
    'chat_id' => $chatId,
    'text' => $message
];

$options = [
    "http" => [
        "header"  => "Content-type: application/x-www-form-urlencoded\r\n",
        "method"  => "POST",
        "content" => http_build_query($params)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);

// Return JSON response
if ($result !== false) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l’envoi à Telegram.']);
}
?>
