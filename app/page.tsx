'use client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface Doctor {
  name: string;
  specialty: string;
  image: string;
  alt: string;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
}

interface Value {
  title: string;
  description: string;
  icon: string;
}

export default function LuxuryHome() {
  const doctors: Doctor[] = [
    {
      name: 'Dr. Ibrahima DIALLO',
      specialty: 'Cardiologie',
      image: '/doctor1.jpg',
      alt: 'Portrait du Dr. Ibrahima DIALLO'
    },
    {
      name: 'Dr. Moussa NDIAYE',
      specialty: 'Dermatologie',
      image: '/doctor2.jpg',
      alt: 'Portrait du Dr. Moussa NDIAYE'
    },
    {
      name: 'Dr. Elisabeth CAMARA',
      specialty: 'Pédiatrie',
      image: '/doctor3.jpg',
      alt: 'Portrait du Dr. Elisabeth CAMARA'
    }
  ];

  const features: Feature[] = [
    {
      title: 'Équipe Expertise',
      description: 'Des praticiens reconnus dans leur domaine, avec des années d\'expérience.',
      icon: '👨‍⚕️'
    },
    {
      title: 'Technologie Avancée',
      description: 'Matériel médical de pointe pour des diagnostics précis et rapides.',
      icon: '🔬'
    },
    {
      title: 'Confort Optimal',
      description: 'Un environnement apaisant et luxueux pour favoriser la guérison.',
      icon: '🛋️'
    }
  ];

  const values: Value[] = [
    {
      title: 'Excellence Médicale',
      description: 'Nous nous engageons à fournir des soins de la plus haute qualité, basés sur les dernières avancées médicales.',
      icon: '⭐'
    },
    {
      title: 'Confidentialité Absolue',
      description: 'Votre vie privée est notre priorité. Toutes vos informations médicales sont protégées avec la plus grande discrétion.',
      icon: '🤫'
    },
    {
      title: 'Approche Personnalisée',
      description: 'Chaque patient bénéficie d\'un programme de soins sur mesure, adapté à ses besoins spécifiques.',
      icon: '🎯'
    }
  ];

  return (
    <div className="bg-white dark:bg-emerald-950 overflow-hidden">
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-emerald-50/30 dark:from-emerald-900 dark:via-emerald-950 dark:to-emerald-900/90" />
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
          >
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:100px_100px] opacity-10" />
          </motion.div>
        </div>

        <div className="container relative z-10 px-6 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl sm:max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-full dark:text-emerald-300 dark:bg-emerald-900/30">
                Soins personnalisés & excellence
              </div>
            </motion.div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300">
                Excellence Médicale
              </span>
              <br />
              <span className="text-gray-900 dark:text-white font-light">
                à Votre Service
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
            >
              Découvrez une expérience de soins inégalée avec nos spécialistes renommés.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
            >
              <Link href="/register" passHref legacyBehavior>
                <Button 
                  asChild
                  className="w-full sm:w-auto px-8 py-6 text-base font-medium rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <a>Commencer l'Expérience</a>
                </Button>
              </Link>
              <Link href="/about" passHref legacyBehavior>
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto px-8 py-6 text-base font-medium rounded-full border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50/20 dark:hover:bg-gray-800/50 transition-all duration-300"
                >
                  <a>Notre Philosophie</a>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <WaveDivider />
      </section>

      <DoctorSection doctors={doctors} />
      <FeaturesSection features={features} />
      <ValuesSection values={values} />
      <CTASection />
    </div>
  );
}


const WaveDivider = () => (
  <div className="absolute bottom-0 left-0 w-full overflow-hidden z-0">
    <svg
      viewBox="0 0 1200 120"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-white dark:fill-emerald-950"
      preserveAspectRatio="none"
    >
      <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
      <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
      <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
    </svg>
  </div>
);

const DoctorSection = ({ doctors }: { doctors: Doctor[] }) => (
  <section className="relative py-24 bg-gray-50 dark:bg-emerald-900/40">
    <div className="container px-6 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-20"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-600">
            Nos Experts Médicaux
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Rencontrez notre équipe de spécialistes certifiés, dévoués à votre bien-être.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {doctors.map((doc, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group">
              <div className="relative h-64">
                <Image 
                  src={doc.image} 
                  alt={doc.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={index < 2}
                />
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold">{doc.name}</h3>
                <p className="text-emerald-600 dark:text-emerald-400">{doc.specialty}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FeaturesSection = ({ features }: { features: Feature[] }) => (
  <section className="relative py-24">
    <div className="container px-6 mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-600">
            Pourquoi Nous Choisir ?
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Des soins sur mesure, une équipe compétente et des installations modernes.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {features.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="text-center p-8 shadow-md hover:shadow-xl transition-shadow h-full">
              <div className="text-4xl mb-4">{item.icon}</div>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ValuesSection = ({ values }: { values: Value[] }) => (
  <section className="relative py-24 overflow-hidden bg-gray-50 dark:bg-emerald-900/20">
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/20 to-emerald-100/20 dark:from-emerald-900/30 dark:to-emerald-950/20" />
      <div className="absolute inset-0 bg-[url('/luxury-pattern.svg')] bg-[size:800px] opacity-10 dark:opacity-5" />
    </div>
    <div className="container px-6 mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-20"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-emerald-600">
            Nos Valeurs Fondamentales
          </span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Les principes qui guident notre approche des soins médicaux.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {values.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 h-full">
              <CardContent className="space-y-6 text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="relative py-24 bg-gradient-to-r from-emerald-600 to-emerald-700 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-10">
      <div className="absolute inset-0 bg-[url('/luxury-dots.svg')] bg-[size:100px_100px]" />
    </div>
    <div className="container px-6 mx-auto text-center relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
          Prêt à vivre l'excellence médicale ?
        </h2>
        <p className="text-lg text-emerald-100 mb-10 max-w-3xl mx-auto">
          Rejoignez notre cercle privilégié de patients et accédez à des soins d'exception, sur mesure pour vos besoins.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/contact" passHref legacyBehavior>
            <Button
              asChild
              className="w-full sm:w-auto px-8 py-6 text-base font-medium rounded-full bg-white text-emerald-600 hover:bg-gray-100 hover:text-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <a>Prendre Rendez-vous</a>
            </Button>
          </Link>
          <Link href="/services" passHref legacyBehavior>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-auto px-8 py-6 text-base font-medium rounded-full border-2 border-white text-white hover:bg-white/10 hover:border-white/80 transition-all duration-300"
            >
              <a>Découvrir nos Services</a>
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);