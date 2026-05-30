<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json; charset=utf-8');

function respond(bool $success, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

$autoloadCandidates = [
    __DIR__ . '/../vendor/autoload.php',
    __DIR__ . '/../../vendor/autoload.php',
];

$autoloadPath = null;

foreach ($autoloadCandidates as $candidate) {
    if (file_exists($candidate)) {
        $autoloadPath = $candidate;
        break;
    }
}

if (!$autoloadPath) {
    respond(false, 'PHPMailer nav uzstādīts. Palaidiet: composer require phpmailer/phpmailer', 500);
}

require $autoloadPath;

$config = [
    'smtp_host' => 'smtp.gmail.com',
    'smtp_username' => 'kristersla@gmail.com',
    'smtp_password' => 'efdi vgan zynl hklb',
    'smtp_port' => 587,
    'smtp_secure' => PHPMailer::ENCRYPTION_STARTTLS,

    'from_email' => 'kristersla@gmail.com',
    'from_name' => 'Heliotherm Baltics Website Form',
    'to_email' => 'kristers.laganovskis@nestswipe.com',

    'recaptcha_secret' => '6LcrhgQtAAAAALaRUGHSE0v79G2RdPi7QgXEKBqL',
];

function clean_value($value): string
{
    if (is_array($value)) {
        $cleaned = [];

        foreach ($value as $item) {
            $cleaned[] = clean_value($item);
        }

        return implode(', ', array_filter($cleaned));
    }

    return trim(strip_tags((string) $value));
}

function post_value(string $key): string
{
    return clean_value($_POST[$key] ?? '');
}

function html_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

function verify_recaptcha(string $secret, string $token): bool
{
    if ($secret === '' || $secret === 'PASTE_RECAPTCHA_SECRET_KEY_HERE') {
        return false;
    }

    if ($token === '') {
        return false;
    }

    $postData = http_build_query([
        'secret' => $secret,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
    ]);

    $context = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $postData,
            'timeout' => 10,
        ],
    ]);

    $verifyResponse = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);

    if ($verifyResponse === false && function_exists('curl_init')) {
        $curl = curl_init('https://www.google.com/recaptcha/api/siteverify');

        curl_setopt_array($curl, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/x-www-form-urlencoded',
            ],
        ]);

        $verifyResponse = curl_exec($curl);
        curl_close($curl);
    }

    if (!$verifyResponse) {
        return false;
    }

    $captchaResult = json_decode($verifyResponse, true);

    return !empty($captchaResult['success']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Atļauts tikai POST pieprasījums.', 405);
}

if (!empty($_POST['website'])) {
    respond(true, 'Pieteikums nosūtīts veiksmīgi.');
}

if (
    empty($config['smtp_username']) ||
    $config['smtp_username'] === 'YOUR_GMAIL_ADDRESS@gmail.com' ||
    empty($config['smtp_password']) ||
    $config['smtp_password'] === 'YOUR_GOOGLE_APP_PASSWORD' ||
    $config['smtp_password'] === 'PASTE_GMAIL_APP_PASSWORD_HERE'
) {
    respond(false, 'Servera e-pasta konfigurācija nav pabeigta.', 500);
}

$recaptchaToken = $_POST['g-recaptcha-response'] ?? '';

if (!verify_recaptcha($config['recaptcha_secret'], (string) $recaptchaToken)) {
    respond(false, 'reCAPTCHA pārbaude neizdevās. Lūdzu, apstipriniet, ka neesat robots.', 400);
}

$firstName = post_value('first_name');
$lastName = post_value('last_name');
$email = post_value('email');

if ($firstName === '') {
    respond(false, 'Lūdzu, ievadiet vārdu.', 400);
}

if ($lastName === '') {
    respond(false, 'Lūdzu, ievadiet uzvārdu.', 400);
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Lūdzu, ievadiet korektu e-pasta adresi.', 400);
}

$fields = [
    'Jūs esat' => post_value('client_type'),
    'Firma' => post_value('company'),
    'Uzruna' => post_value('salutation'),
    'Vārds' => $firstName,
    'Uzvārds' => $lastName,
    'Iela / mājas numurs' => post_value('street'),
    'Pasta indekss' => post_value('postcode'),
    'Pilsēta' => post_value('city'),
    'Tālrunis' => post_value('phone'),
    'E-pasts' => $email,
    'Jūsu ziņojums' => post_value('message'),
    'Būvprojekts' => post_value('project_type'),
    'Konsultācija' => post_value('consultation'),
    'Informāciju par siltumsūkņiem vēlos saņemt' => clean_value($_POST['info_channel'] ?? ''),
    'Papildu informācija specializētajiem partneriem' => post_value('partner_info'),
    'Pieredze aukstumtehnikas jomā' => post_value('cooling_experience'),
    'Prospekti' => clean_value($_POST['prospects'] ?? ''),
];

$htmlBody = '<h2 style="font-family:Arial,sans-serif;">Jauns Heliotherm pieteikums</h2>';
$htmlBody .= '<table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px;">';

$plainBody = "Jauns Heliotherm pieteikums\n\n";

foreach ($fields as $label => $value) {
    $displayValue = $value !== '' ? $value : '-';

    $htmlBody .= '<tr>';
    $htmlBody .= '<td style="font-weight:bold;background:#f5f5f5;width:35%;">' . html_escape($label) . '</td>';
    $htmlBody .= '<td>' . nl2br(html_escape($displayValue)) . '</td>';
    $htmlBody .= '</tr>';

    $plainBody .= $label . ': ' . $displayValue . "\n";
}

$htmlBody .= '</table>';
$htmlBody .= '<p style="font-family:Arial,sans-serif;font-size:13px;color:#666;margin-top:16px;">';
$htmlBody .= 'Forma nosūtīta ar apstiprinātu reCAPTCHA pārbaudi.';
$htmlBody .= '</p>';

$plainBody .= "\nForma nosūtīta ar apstiprinātu reCAPTCHA pārbaudi.\n";

try {
    $mail = new PHPMailer(true);

    $mail->CharSet = 'UTF-8';
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];

    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['to_email']);
    $mail->addReplyTo($email, $firstName . ' ' . $lastName);

    $mail->isHTML(true);
    $mail->Subject = 'Jauns Heliotherm pieteikums: ' . $firstName . ' ' . $lastName;
    $mail->Body = $htmlBody;
    $mail->AltBody = $plainBody;

    $mail->send();

    respond(true, 'Pieteikums nosūtīts veiksmīgi.');
} catch (Exception $e) {
    respond(false, 'Neizdevās nosūtīt pieteikumu. Lūdzu, mēģiniet vēlreiz.', 500);
}