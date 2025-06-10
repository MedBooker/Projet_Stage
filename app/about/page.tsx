'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface Value {
  title: string;
  description: string;
  icon: string;
}

interface Milestone {
  year: string;
  event: string;
  description: string;
}

export default function AboutPage() {
  const values: Value[] = [
    {
      title: 'Excellence Médicale',
      description: 'Nous nous engageons à fournir des soins de la plus haute qualité, basés sur les dernières avancées médicales et les protocoles les plus rigoureux.',
      icon: '⭐'
    },
    {
      title: 'Approche Holistique',
      description: 'Nous considérons chaque patient dans sa globalité, en prenant en compte son bien-être physique, émotionnel et mental.',
      icon: '🌿'
    },
    {
      title: 'Confidentialité Absolue',
      description: 'Votre vie privée est sacrée. Toutes vos informations médicales sont protégées avec la plus grande discrétion et sécurité.',
      icon: '🔒'
    },
    {
      title: 'Innovation Constante',
      description: 'Nous investissons continuellement dans les technologies médicales les plus avancées et la formation de notre équipe.',
      icon: '🚀'
    }
  ];

  const milestones: Milestone[] = [
    {
      year: '2010',
      event: 'Fondation',
      description: 'Création de la clinique avec une vision révolutionnaire des soins médicaux haut de gamme.'
    },
    {
      year: '2014',
      event: 'Première Expansion',
      description: 'Ouverture de notre département de médecine préventive et de bien-être.'
    },
    {
      year: '2018',
      event: 'Certification Internationale',
      description: 'Obtention de la certification ISO 9001 pour notre système de gestion de la qualité.'
    },
    {
      year: '2022',
      event: 'Nouvelle Aile',
      description: 'Inauguration de notre centre de diagnostic ultramoderne.'
    }
  ];

  return (
    <div className="bg-white dark:bg-emerald-950 overflow-hidden">
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden px-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-950">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/luxury-pattern.svg')] bg-[size:800px] opacity-30 dark:opacity-10" />
        </div>

        <div className="container relative z-10 px-6 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300">
                Notre Philosophie
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Redéfinir l'excellence en médecine à travers des soins personnalisés et une expérience patient incomparable.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/about-doctor.jpg"
                  alt="Docteur en consultation"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300">
                  Notre Mission
                </span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300">
                <p>
                  Fondée sur la conviction que chaque patient mérite une attention exceptionnelle, notre clinique incarne une nouvelle ère de soins médicaux où l'excellence clinique rencontre le confort ultime.
                </p>
                <p>
                  Nous repoussons les limites de la médecine conventionnelle en offrant une approche intégrative qui combine les meilleures pratiques médicales avec des services sur mesure adaptés aux besoins individuels de nos patients.
                </p>
                <p>
                  Notre engagement va au-delà du traitement des symptômes - nous nous consacrons à optimiser la santé globale et la qualité de vie de ceux qui nous font confiance.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gray-50 dark:bg-emerald-900/20">
        <div className="container px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-600">
                Nos Valeurs Fondamentales
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Les principes intangibles qui guident chacune de nos actions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                <div className="text-5xl mb-4 text-center">{item.icon}</div>
                <CardHeader className="px-0 pt-0 pb-3">
                    <CardTitle className="text-lg font-bold text-center">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 flex-1 flex flex-col">
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-snug text-center flex-1">
                    {item.description}
                    </p>
                </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="container px-6 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-600">
                Notre Parcours
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Les étapes clés qui ont façonné notre excellence
            </p>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 w-1 h-full bg-gradient-to-b from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700 transform -translate-x-1/2" />
            
            <div className="space-y-12">
              {milestones.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center`}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 border-4 border-white dark:border-gray-900 z-10 ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`} />
                  <div className={`flex-1 ${index % 2 === 0 ? 'text-right mr-16' : 'text-left ml-16'}`}>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
                      <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{item.year}</div>
                      <h3 className="text-xl font-bold mb-2">{item.event}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gray-50 dark:bg-emerald-900/20">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/medical-team.jpg"
                  alt="Notre équipe médicale"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-8">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300">
                  L'Esprit d'Équipe
                </span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300">
                <p>
                  Notre force réside dans notre équipe pluridisciplinaire de professionnels de santé partageant une même vision : celle d'une médecine à la fois humaine et ultra-performante.
                </p>
                <p>
                  Chaque membre de notre équipe est sélectionné non seulement pour son expertise technique exceptionnelle, mais aussi pour son engagement envers les valeurs fondamentales de notre clinique.
                </p>
                <p>
                  Nous cultivons un environnement collaboratif où le partage des connaissances et l'innovation permanente permettent d'offrir à nos patients des solutions thérapeutiques toujours plus efficaces et personnalisées.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-24 bg-gradient-to-r from-emerald-600 to-emerald-700 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute inset-0 bg-[url('/luxury-dots.svg')] bg-[size:100px_100px]" />
        </div>
        <div className="container px-6 mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à découvrir notre approche unique ?
            </h2>
            <p className="text-lg text-emerald-100 mb-10 max-w-3xl mx-auto">
              Prenez rendez-vous avec l'un de nos spécialistes et faites l'expérience d'une médecine différente.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/contact" passHref legacyBehavior>
                <Button
                  asChild
                  className="w-full sm:w-auto px-8 py-6 text-base font-medium rounded-full bg-white text-emerald-600 hover:bg-gray-100 hover:text-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <a>Contactez-nous</a>
                </Button>
              </Link>
              <Link href="/services" passHref legacyBehavior>
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-6 text-base font-medium rounded-full border-2 border-white text-white hover:bg-white/10 hover:border-white/80 transition-all duration-300"
                >
                  <a>Nos Services</a>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}