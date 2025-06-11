import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-950">
      <div className="container px-6 py-16 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <svg className="h-8 w-8 text-emerald-600" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91c4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
              </svg>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                Clinique Amitié
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Excellence médicale et accompagnement personnalisé pour votre bien-être.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Navigation</h3>
            <ul className="space-y-3">
              {[
                { name: "Médecins", href: "/doctors" },
                { name: "Services", href: "/services" },
                { name: "Tarifs", href: "/pricing" },
                { name: "FAQ", href: "/faq" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors duration-300 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Contact</h3>
            <address className="not-italic text-gray-600 dark:text-gray-400 space-y-3">
              <div className="flex items-start">
                <svg className="w-5 h-5 mt-0.5 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Liberté 6 BP: 15282 Dakar<br />Fann - Dakar / Sénégal</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@clinique-amitie.com
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +221 33 257 89 74
              </div>
            </address>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Newsletter</h3>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-700"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-400 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-500 transition-all duration-300 w-full flex items-center justify-center"
              >
                S'abonner
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-16 pt-8 text-center">
          <p className="text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Clinique Amitié. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}