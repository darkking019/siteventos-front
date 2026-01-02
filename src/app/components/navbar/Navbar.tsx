'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;
    const token = localStorage.getItem('auth_token');

    if (token) {
      try {
        await fetch(`${API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
      } catch {}
    }

    localStorage.removeItem('auth_token');
    logout();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/img/icone.jpg"
            alt="DEV EVENTS"
            width={42}
            height={42}
            className="rounded-lg"
          />
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            DEV EVENTS
          </span>
        </Link>

        {/* Links principais */}
        <ul className="hidden md:flex items-center gap-8 font-medium">
          <li>
            <Link href="/events" className="hover:text-indigo-600 transition">
              Eventos
            </Link>
          </li>

          {user && (
            <li>
              <Link href="/events/create" className="hover:text-indigo-600 transition">
                Criar evento
              </Link>
            </li>
          )}

          <li>
            <Link href="/contact" className="hover:text-indigo-600 transition">
              Contato
            </Link>
          </li>
        </ul>

        {/* Auth */}
        <div className="flex items-center gap-6 font-medium">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-indigo-600 transition">
                Meus eventos
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 transition"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-indigo-600 transition">
                Entrar
              </Link>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
