<?php
// Hide PHP errors from users
error_reporting(0);

// Secure credentials
$botToken = '7975014617:AAElGXu2Fj59MQ82FsILv4MN4J4jtwlGN1k';
$chatId = '6445039270';

// Sanitize input
function clean($data) {
  return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$depart = clean($_POST['adresse_depart']);
$arrivee = clean($_POST['adresse']);
$courseTime = $_POST['course-time'] === 'later' ? 'Plus tard' : 'Maintenant';
$date = clean($_POST['pick_date']) ?: 'Non spécifiée';
$time = clean($_POST['pick_time']) ?: 'Non spécifiée';
$phone = clean($_POST['phone']);

// Format the message
$message = "
🚖 Nouvelle Réservation :
📍 Départ : $depart
📍 Arrivée : $arrivee
🕒 Quand : $courseTime
📅 Date : $date
⏰ Heure : $time
📞 Téléphone : $phone
";

// Send to Telegram
$url = "https://api.telegram.org/bot$botToken/sendMessage";
$data = [
  'chat_id' => $chatId,
  'text' => $message
];
$options = [
  'http' => [
    'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
    'method'  => 'POST',
    'content' => http_build_query($data),
  ]
];

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

// Feedback
if ($result) {
  echo "<script>alert('✅ Votre demande a été envoyée avec succès !'); window.history.back();</script>";
} else {
  echo "<script>alert('❌ Erreur lors de l\\'envoi. Veuillez réessayer.'); window.history.back();</script>";
}
?>
