<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $message = $_POST['message'] ?? '';

    // Aquí puedes procesar los datos, como guardarlos en una base de datos o enviar un correo electrónico
    echo "Gracias, $name. Oye, ya te suscribiste al canal?";
}
?>
