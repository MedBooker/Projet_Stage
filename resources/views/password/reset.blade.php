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
  <p>Veuillez cliquer sur ce lien pour modifier votre mot de passe:</p>
  <p><a href="{{ $url }}" target="_blank">Reinitialisation de  mon mot de passe</a></p>
  <p>Si vous n'avez pas effectué cette demande, veuillez ignorer cet email.</p>
  <p class="footer">Cordialement,<br>Équipe Clinique de l'Amitié</p>
  <p class="footer">Ce message a été envoyé automatiquement. Nous vous remercions de ne pas répondre.</p>
</body>
</html>