"use client";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Informations() {
  return (
    <Card className="shadow-lg">
      <CardContent className="px-8 py-6">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-blue-500 mt-1" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Adresse</h3>
              <p className="text-gray-600">89 Rue du Dauphiné</p>
              <p className="text-gray-600">69800 Saint-Priest</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-blue-500 mt-1" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Téléphone</h3>
              <p className="text-gray-600">09 51 52 28 80</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-500 mt-1" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">lyonmarquage@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-500 mt-1" />
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">Horaires</h3>
              <p className="text-gray-600">Lundi - Vendredi</p>
              <p className="text-gray-600">9h00 - 18h00</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}