"use client";
import FormContact from "@/components/shared/FormContact";
import Informations from "@/components/shared/Informations";
import React from "react";

const Contact = () => {
  return (
    <div className="mt-28">
      {/* Header Section avec design amélioré */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-16 mb-16">
        <div className="container mx-auto max-w-4xl text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Contactez-nous
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Pour obtenir des informations supplémentaires ou des conseils adaptés à vos besoins,
            n'hésitez pas à nous contacter. Notre équipe se tient à votre entière disposition !
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-14">
        {/* Form and Info Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Information component */}
          <div className="lg:col-span-4 lg:col-start-2 w-full">
            <Informations />
          </div>

          {/* Form component */}
          <div className="lg:col-span-5 w-full">
            <FormContact />
          </div>
        </section>

        {/* Map section with title */}
        <section id="map" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Notre localisation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Retrouvez-nous à notre adresse à Saint-Priest
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg h-[400px] bg-gray-100">
            {/* Map component will go here - placeholder for now */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">Carte Google Maps</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
