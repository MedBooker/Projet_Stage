<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentCancelledMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public $nom;
    public $prenom;
    public $creneau;
    public $medecin;
    public $date;
    public function __construct($nom, $prenom, $creneau, $medecin, $date)
    {
        //
        $this->nom = $nom;
        $this->prenom = $prenom;
        $this->creneau = $creneau;
        $this->medecin = $medecin;
        $this->date = $date;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Rendez-vous annulé',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'rdv.cancel',
            with: [
                'nom' => $this->nom,
                'prenom' => $this->prenom,
                'medecin' => $this->medecin,
                'creneau' => $this->creneau,
                'date' => $this->date,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
