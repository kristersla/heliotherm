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
    $config['smtp_password'] === 'YOUR_GOOGLE_APP_PASSWORD'
) {
    respond(false, 'Servera e-pasta konfigurācija nav pabeigta.', 500);
}

$firstName = post_value('first_name');
$lastName = post_value('last_name');
$email = post_value('email');
$privacy = $_POST['privacy'] ?? '';

if ($firstName === '') {
    respond(false, 'Lūdzu, ievadiet vārdu.', 400);
}

if ($lastName === '') {
    respond(false, 'Lūdzu, ievadiet uzvārdu.', 400);
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Lūdzu, ievadiet korektu e-pasta adresi.', 400);
}

if ($privacy !== '1') {
    respond(false, 'Lūdzu, apstipriniet piekrišanu datu apstrādei.', 400);
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
$htmlBody .= '<p style="font-family:Arial,sans-serif;font-size:13px;color:#666;margin-top:16px;">Piekrišana datu apstrādei: Jā</p>';

$plainBody .= "\nPiekrišana datu apstrādei: Jā\n";

$allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'webp'];
$maxTotalSize = 10 * 1024 * 1024;
$totalSize = 0;
$attachments = [];

if (!empty($_FILES['project_files']) && is_array($_FILES['project_files']['name'])) {
    $fileCount = count($_FILES['project_files']['name']);

    for ($i = 0; $i < $fileCount; $i++) {
        $error = $_FILES['project_files']['error'][$i];

        if ($error === UPLOAD_ERR_NO_FILE) {
            continue;
        }

        if ($error !== UPLOAD_ERR_OK) {
            respond(false, 'Neizdevās augšupielādēt vienu no failiem.', 400);
        }

        $tmpName = $_FILES['project_files']['tmp_name'][$i];
        $originalName = $_FILES['project_files']['name'][$i];
        $size = (int) $_FILES['project_files']['size'][$i];

        if (!is_uploaded_file($tmpName)) {
            respond(false, 'Nederīgs augšupielādētais fails.', 400);
        }

        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

        if (!in_array($extension, $allowedExtensions, true)) {
            respond(false, 'Atļautie failu tipi: PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP.', 400);
        }

        $totalSize += $size;

        if ($totalSize > $maxTotalSize) {
            respond(false, 'Failu kopējais izmērs nedrīkst pārsniegt 10MB.', 400);
        }

        $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $originalName);

        $attachments[] = [
            'path' => $tmpName,
            'name' => $safeName ?: 'attachment.' . $extension,
        ];
    }
}

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

    foreach ($attachments as $attachment) {
        $mail->addAttachment($attachment['path'], $attachment['name']);
    }

    $mail->send();

    respond(true, 'Pieteikums nosūtīts veiksmīgi.');
} catch (Exception $e) {
    respond(false, 'Neizdevās nosūtīt pieteikumu. Lūdzu, mēģiniet vēlreiz.', 500);
}