<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #f4f4f9;
      margin: 0;
      padding: 20px;
    }
    h2 {
      color: #4CAF50; 
    }
    .highlight {
        color: #4CAF50;
        font-weight: bold;
        transition: transform 0.3s ease, color 0.3s ease; 
    }
    .highlight:hover {
        transform: scale(1.1); 
        color: #388E3C; 
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      color: #555;
    }
    a {
      color: #007BFF;
      text-decoration: none;
      font-weight: bold;
    }
    a:hover {
      text-decoration: underline;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #777;
    }
  </style>
</head>
<body>
  <h2>Bonjour {{ $prenom }} {{ $nom }},</h2>
  <p>Nous vous informons que votre rendez-vous avec <span class="highlight">{{ $medecin }}</span> prévu le <span class="highlight">{{ $date }}</span> au créneau <span class="highlight">{{ $creneau }}</span> a été annulé.</p>
  <p>Nous vous présentons nos excuses pour ce désagrément. Si vous souhaitez reprogrammer votre rendez-vous, n'hésitez pas à le faire directement sur la plateforme.</p>
  <p class="footer">Cordialement,<br>Équipe Clinique de l'Amitié</p>
  <p class="footer">Ce message a été envoyé automatiquement. Nous vous remercions de ne pas répondre.</p>
</body>
</html>