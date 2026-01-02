import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext'; // ← Corrigido: use alias @ (src/)
import Navbar from '@/app/components/navbar/Navbar';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // Opcional: permite usar como variável CSS
});

export const metadata = {
  title: {
    default: 'DEVEvents',
    template: '%s | DEV Events', 
  },
  description: 'Gerencie e participe de eventos incríveis',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}>
      
        <AuthProvider>
          {/* Navbar como client component */}
          <Navbar />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </main>

          <footer className="bg-gray-800 text-white py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p>DEV &copy; {new Date().getFullYear()} - Todos os direitos reservados</p>
              <div className="flex gap-6 text-sm">
                <a href="/about" className="hover:text-gray-300 transition">Sobre</a>
                <a href="/contact" className="hover:text-gray-300 transition">Contato</a>
                <a href="/privacy" className="hover:text-gray-300 transition">Privacidade</a>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
