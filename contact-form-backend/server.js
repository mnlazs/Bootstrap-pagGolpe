const dotenv = require('dotenv');
dotenv.config({ path: '../.env' }); 

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de la solicitud
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta raíz para probar que el servidor está activo
app.get('/', (req, res) => {
    res.send('Bienvenido a mi servidor de correo!');
});

// Configurar CORS (opcional, si es necesario)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Ruta para manejar el envío del formulario
app.post('/send-email',async  (req, res) => {
    const { name, email, message } = req.body;
    console.log("Received request ")

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: email,
        to: 'mnl.azs@gmail.com',
        subject: `Mensaje de ${name}`,
        text: message,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return res.status(200).json({ success: true, message: 'Correo enviado correctamente', info });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).json({ success: false, message: 'Error al enviar el correo', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
