'use client';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: 'Consultation Générale',
      description: 'Examen médical complet réalisé par des généralistes expérimentés pour un diagnostic précis.',
      icon: '🩺',
      features: [
        'Bilan de santé complet',
        'Prescriptions médicales',
        'Orientation vers spécialistes',
        'Durée : 30-45 min'
      ],
      badge: 'Disponible aujourd\'hui'
    },
    {
      id: 2,
      title: 'Soins Spécialisés',
      description: 'Accès direct à des spécialistes renommés dans plus de 15 disciplines médicales.',
      icon: '🔬',
      features: [
        'Cardiologie',
        'Dermatologie',
        'Pédiatrie',
        'Neurologie',
        'Et plus...'
      ],
      badge: 'RDV sous 48h'
    },
    {
      id: 3,
      title: 'Suivi Post-opératoire',
      description: 'Programme personnalisé de récupération après intervention chirurgicale.',
      icon: '🛏️',
      features: [
        'Visites de contrôle',
        'Rééducation sur mesure',
        'Gestion de la douleur',
        'Suivi à domicile possible'
      ],
      badge: 'Forfait disponible'
    },
    {
      id: 4,
      title: 'Téléconsultation',
      description: 'Consultation médicale à distance avec nos praticiens certifiés.',
      icon: '💻',
      features: [
        'Via plateforme sécurisée',
        'Ordonnances électroniques',
        'Disponible 7j/7',
        'Remboursable'
      ],
      badge: 'Immédiat'
    },
    {
      id: 5,
      title: 'Médecine Préventive',
      description: 'Programmes de prévention et dépistage pour maintenir votre capital santé.',
      icon: '🛡️',
      features: [
        'Bilans annuels',
        'Dépistage précoce',
        'Vaccinations',
        'Conseils nutritionnels'
      ],
      badge: 'Nouveau'
    },
    {
      id: 6,
      title: 'Urgences Médicales',
      description: 'Prise en charge rapide et efficace des situations urgentes 24h/24.',
      icon: '🚑',
      features: [
        'Equipe disponible H24',
        'Plateau technique complet',
        'Liaison avec SMUR',
        'Hospitalisation si nécessaire'
      ],
      badge: 'Urgence'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-900/20 dark:to-emerald-950 py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300">
              Nos Services Médicaux
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Une gamme complète de soins personnalisés pour répondre à tous vos besoins de santé.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card className="h-full flex flex-col border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    {service.badge && (
                      <Badge 
                        variant="outline"
                        className={`${
                          service.badge === 'Urgence' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200' :
                          service.badge === 'Nouveau' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200' :
                          'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                        }`}
                      >
                        {service.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="mt-2">{service.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Link href={`/services/${service.id}`} passHref legacyBehavior>
                    <Button asChild variant="outline" className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30">
                      <a className="flex items-center justify-center">
                        Découvrir ce service
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Vous ne trouvez pas ce que vous cherchez ?
          </h2>
          <Link href="/contact" passHref legacyBehavior>
            <Button asChild className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white">
              <a>Contactez notre équipe</a>
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}