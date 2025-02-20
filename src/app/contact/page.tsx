"use client";
import FormContact from "@/components/shared/FormContact";
import Informations from "@/components/shared/Informations";
import React from "react";

const Contact = () => {
  return (
    <div className="mt-28">
      {/* Header Section - Centered */}
      <section id="contact" className="container mx-auto max-w-4xl text-center px-4 mb-12">
        <h1 className="text-4xl font-bold mb-6">Contactez-nous</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Pour obtenir des informations supplémentaires ou des conseils adaptés à vos besoins,
          n'hésitez pas à nous contacter. Notre équipe se tient à votre entière disposition !
        </p>
      </section>

      {/* Main Content */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-14">
        {/* Form and Info Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Information component - 1/3 width */}
          <div className="lg:col-span-2 lg:col-start-3 w-full">
            <Informations />
          </div>

          {/* Form component - 2/3 width */}
          <div className="lg:col-span-5 w-full">
            <FormContact />
          </div>
        </section>

        {/* Map section */}
        <section id="map" className="mb-16">
          {/* Map component will go here */}
        </section>
      </div>
    </div>
  );
};

export default Contact;
