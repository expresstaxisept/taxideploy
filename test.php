<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $value = htmlspecialchars($_POST['test']);
  echo "✅ POST reçu avec succès !<br>Valeur reçue : " . $value;
} else {
  echo "❌ Cette page accepte uniquement les requêtes POST.";
}
?>
