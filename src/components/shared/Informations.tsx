"use client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Informations() {
  return (
    <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
      <CardContent className="p-0">
        {/* Header avec fond coloré et padding uniforme */}
        <div className="bg-blue-600 text-white px-6 py-5">
          <h2 className="text-xl font-bold">Nos coordonnées</h2>
          <p className="text-blue-100 text-sm mt-1">N&apos;hésitez pas à nous contacter</p>
        </div>

        {/* Container principal avec padding uniforme et espacement constant */}
        <div className="p-6 space-y-6">
          {/* Chaque bloc d'information avec structure identique */}
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
              <p className="text-gray-600 text-sm">89 Rue du Dauphiné, 69800, Saint-Priest</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
              <p className="text-gray-600 text-sm">09 51 52 28 80</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-600 text-sm">info@lyonmarquage.fr</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 mb-2">Horaires</h3>
              <div className="text-gray-600 space-y-2">
                {/* Lundi à Jeudi */}
                <div className="border-l-2 border-blue-200 pl-3">
                  <p className="font-medium text-blue-600">Lundi à Jeudi</p>
                  <div className="space-y-1 mt-1">
                    <p>
                      Matin :{" "}
                      <span className="font-semibold text-gray-800">Fermé (sauf livraison)</span>
                    </p>
                    <p>
                      Après-midi : <span className="font-semibold text-gray-800">14h - 18h</span>
                    </p>
                  </div>
                </div>

                {/* Vendredi */}
                <div className="border-l-2 border-red-200 pl-3 mt-2">
                  <p className="font-medium text-red-500">Vendredi</p>
                  <div className="space-y-1 mt-1">
                    <p>
                      Matin : <span className="font-semibold text-gray-800">9h - 12h</span>
                    </p>
                    <p>
                      Après-midi : <span className="font-semibold text-gray-800">Fermé</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
