"use client";
import FormContact from "@/components/shared/FormContact";
import React from "react";

const Contact = () => {
  return (
    <div className="flex flex-col items-center mt-36 text-center">
      <section id="contact" className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold mb-6">Contactez-nous</h1>
        <p className="text-lg">
          Pour obtenir des informations supplémentaires ou des conseils adaptés à vos besoins,
          n'hésitez pas à nous contacter. Notre équipe se tient à votre entière disposition !
        </p>
      </section>
      <section id="form" className="container mx-auto max-w-4xl mt-4">
        <FormContact />
      </section>
      <section id="map" className="container mx-auto max-w-4xl mt-4"></section>
    </div>
  );
};
export default Contact;
