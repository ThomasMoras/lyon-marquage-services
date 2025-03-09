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
              <p className="text-gray-600 text-sm">69800 Saint-Priest</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
              <p className="text-gray-600 text-sm">XX XX XX XX XX</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
              <p className="text-gray-600 text-sm">contact@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div className="ml-4">
              <h3 className="font-semibold text-gray-900 mb-1">Horaires</h3>
              <div className="text-gray-600 text-sm">
                <p>Lundi - Vendredi</p>
                <p>9h00 - 18h00</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
