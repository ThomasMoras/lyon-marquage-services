"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  // Rediriger si déjà connecté
  useEffect(() => {
    if (status === "authenticated") {
      // router.push("/");
    }
  }, [status, router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signIn("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Erreur d'authentification",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
          duration: 5000,
          action: <ToastAction altText="Réessayer">Réessayer</ToastAction>,
        });
      } else {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
          duration: 3000,
        });
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur technique",
        description: "Une erreur est survenue. Veuillez réessayer",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  // Fonction de déconnexion
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
      duration: 3000,
    });
    router.refresh();
  };

  // Afficher un message de chargement pendant la vérification de la session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  // Afficher un message si l'utilisateur est déjà connecté
  if (status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Déjà connecté</h2>
          <p className="text-center mb-6">
            Vous êtes déjà connecté en tant que {session.user?.name || session.user?.email}.
          </p>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Accueil
              </button>
              {/* <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Dashboard
              </button> */}
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulaire de connexion (s'affiche uniquement si non connecté)
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Connexion</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
