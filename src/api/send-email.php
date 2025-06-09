<?php
// phpinfo();
header('Content-Type: application/json');

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Konfiguracja reCAPTCHA
$recaptchaSecret = $_ENV['RECAPTCHA_SECRET'];
define('RECAPTCHA_URL', 'https://www.google.com/recaptcha/api/siteverify');

$errors = [];
$input = json_decode(file_get_contents('php://input'), true);

// Sanityzacja danych
$name = filter_var($input['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = filter_var($input['phone'] ?? '', FILTER_SANITIZE_STRING);
$subject = filter_var($input['subject'] ?? '', FILTER_SANITIZE_STRING);
$message = filter_var($input['message'] ?? '', FILTER_SANITIZE_STRING);
$recaptchaToken = $input['recaptchaToken'] ?? '';

// Walidacja reCAPTCHA
$recaptchaResponse = file_get_contents(RECAPTCHA_URL . '?secret=' . $recaptchaSecret . '&response=' . $recaptchaToken);
$recaptchaData = json_decode($recaptchaResponse);

if (!$recaptchaData->success || $recaptchaData->score < 0.5) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Weryfikacja reCAPTCHA nie powiodła się']);
    exit;
}

// Walidacja danych
if (empty($name)) $errors[] = 'Imię i nazwisko jest wymagane';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Niepoprawny format email';
if (!preg_match('/^[0-9+\- ]{15,17}$/', $phone)) $errors[] = 'Niepoprawny format telefonu';
if (empty($subject)) $errors[] = 'Temat jest wymagany';
if (empty($message)) $errors[] = 'Wiadomość nie może być pusta';

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => implode(', ', $errors)]);
    exit;
}

// Przygotowanie i wysyłka maila
$to = 'tester@kbb-instal.pl';
$headers = "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if ($subject) {
    switch ($subject) {
    case "services":
        $subject = "usług";
        break;
    case "warehouse":
        $subject = "hurtowni";
        break;
    case "others":
        $subject = "innego";
        break;
}
}

$subject = "Zapytanie dotyczy tematu - " . $subject;
$emailBody = "Wiadomość:\n$message";
$emailBody .= "Imię i nazwisko: $name\n";
$emailBody .= "Email: $email\n";
$emailBody .= "Telefon: $phone\n\n";

if (function_exists('mail')) {
    if (mail($to, $subject, $emailBody, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Błąd podczas wysyłania wiadomości']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Funkcja mail() nie jest dostępna.']);
}
