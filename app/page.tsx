"use client";

import Link from "next/link";
import  Button  from "@/app/components/ui/button/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card/Card";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <Card className="w-full max-w-lg shadow-xl border-gray-200 dark:border-gray-800">
        <CardHeader className="text-center space-y-3">
          <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Bem-vindo de volta! 👋
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
            Você está logado com sucesso. Agora é só aproveitar o sistema!
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          <p className="text-center text-gray-700 dark:text-gray-300">
            A partir daqui você pode acessar seu painel, gerenciar eventos, participantes e muito mais.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="min-w-[200px]">
              <Link href="/dashboard">
                Ir para o Dashboard
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="min-w-[200px]">
              <Link href="/profile">
                Meu Perfil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}