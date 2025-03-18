import React from "react";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SuccessMessageProps {
  onReset: () => void;
}

export function SuccessMessage({ onReset }: SuccessMessageProps) {
  return (
    <Card className="shadow-lg border-0 overflow-hidden rounded-xl">
      <CardContent className="p-6 sm:p-8 text-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Message envoyé avec succès !
          </h3>

          <p className="text-gray-600 dark:text-gray-300 max-w-md">
            Merci pour votre message. Nous l'avons bien reçu et nous vous répondrons dans les plus
            brefs délais.
          </p>

          <Button
            onClick={onReset}
            className="mt-4 w-full md:w-auto px-6 py-2 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          >
            Envoyer un autre message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
