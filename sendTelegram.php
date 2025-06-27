<?php
// Your secret tokens here — NOT visible on client side!
$botToken = '7975014617:AAElGXu2Fj59MQ82FsILv4MN4J4jtwlGN1k';
$chatId = '6445039270';

// Read POST JSON data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

// Sanitize inputs (basic example)
$depart = htmlspecialchars($input['adresse_depart'] ?? 'Non spécifié');
$arrivee = htmlspecialchars($input['adresse'] ?? 'Non spécifié');
$courseTime = htmlspecialchars($input['course-time'] ?? 'Non spécifié');
$date = htmlspecialchars($input['pick_date'] ?? 'Non spécifié');
$time = htmlspecialchars($input['pick_time'] ?? 'Non spécifié');
$phone = htmlspecialchars($input['phone'] ?? 'Non spécifié');

$message = "
🚖 Nouvelle Réservation :
📍 Départ : $depart
📍 Arrivée : $arrivee
🕒 Quand : " . ($courseTime === 'now' ? 'Maintenant' : 'Plus tard') . "
📅 Date : $date
⏰ Heure : $time
📞 Téléphone : $phone
";

// Prepare Telegram API URL
$url = "https://api.telegram.org/bot$botToken/sendMessage";

// POST data
$postFields = [
    'chat_id' => $chatId,
    'text' => $message,
];

// Use cURL to send message
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);

// Check result and respond accordingly
if ($result !== false) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false]);
}
?>
