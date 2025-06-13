<?php
header('Content-Type: application/json');

require_once __DIR__ . '/../vendor/autoload.php';

try {
    $envDir = __DIR__ . '/../app/config/';
    $envFile = $envDir . '.env';

    if (file_exists($envFile)) {
        $dotenv = Dotenv\Dotenv::createImmutable($envDir);
        $dotenv->safeLoad();

        // Konfiguracja reCAPTCHA
        $recaptchaSecret = $_SERVER['RECAPTCHA_SECRET'];
        define('RECAPTCHA_URL', 'https://www.google.com/recaptcha/api/siteverify');

        $errors = [];
        $input = json_decode(file_get_contents('php://input'), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Nieprawidłowy format JSON');
        }



        // Sanityzacja danych
        $name = htmlspecialchars($input['name'] ?? '', ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5);
        $email = filter_var($input['email'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
        $phone = htmlspecialchars($input['phone'] ?? '', ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5);
        $subject = htmlspecialchars($input['subject'] ?? '', ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5);
        $message = htmlspecialchars($input['message'] ?? '', ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5);
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
        $to = 'k.brzozowski@kbb-instal.pl';
        $headers = "From: " . $email . "\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        if ($subject) {
            switch ($subject) {
                case "services":
                    $subject = "[USLUGI]";
                    break;
                case "warehouse":
                    $subject = "[HURTOWNIA]";
                    break;
                case "others":
                    $subject = "[INNE]";
                    break;
            }
        }

        $subject = $subject . " - zapytanie z formularza kontaktowego";
        $emailBody = "
        <html>
                        <head>
                            <meta charset=\"utf-8\">
                        </head>
                        <body>
                            <p>Wiadomość od Pana/Pani: <strong>$name</strong></p>
                            <p>$message</p><br />
                            <hr />
                            <p><u>Dane kontaktowe: </u></p>
                            <p>Email: <strong>$email</strong></p>
                            <p>Telefon: <strong>$phone</strong></p>
                        </body>
                    </html>";

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
    } else {
        throw new Exception("Plik .env NIE istnieje pod ścieżką:" . realpath($envPath) . "/.env\n");
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    exit;
}
