"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, "Le nom ne peut contenir que des lettres, espaces et tirets"),
  lastName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s-]+$/, "Le prénom ne peut contenir que des lettres, espaces et tirets"),
  email: z
    .string()
    .email("Adresse email invalide")
    .min(5, "L'email doit contenir au moins 5 caractères")
    .max(100, "L'email ne peut pas dépasser 100 caractères"),
  subject: z
    .string()
    .min(5, "L'objet doit contenir au moins 5 caractères")
    .max(100, "L'objet ne peut pas dépasser 100 caractères"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(1000, "Le message ne peut pas dépasser 1000 caractères"),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Une erreur est survenue lors de l'envoi du message");
      }

      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
        duration: 5000,
        variant: "default",
        action: (
          <ToastAction altText="Fermer">Fermer</ToastAction>
        ),
      });
      
      form.reset();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue est survenue";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
        action: (
          <ToastAction altText="Réessayer">Réessayer</ToastAction>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-lg">
        {/* <div className="bg-white px-8 py-6 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">Contactez-nous</h2>
          <p className="mt-2 text-gray-600">
            Pour obtenir des informations supplémentaires ou des conseils adaptés à vos besoins,
            n'hésitez pas à nous contacter.
          </p>
        </div> */}
        <CardContent className="px-8 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel className="text-base font-semibold text-gray-700 text-left flex items-center gap-1">
                        Nom
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          className="h-12 text-lg px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Votre nom"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel className="text-base font-semibold text-gray-700 text-left flex items-center gap-1">
                        Prénom
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 text-lg px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Votre prénom"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel className="text-base font-semibold text-gray-700 text-left flex items-center gap-1">
                        Email
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 text-lg px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          type="email"
                          placeholder="votremail@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel className="text-base font-semibold text-gray-700 text-left flex items-center gap-1">
                        Objet
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-12 text-lg px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="A propos de votre commande"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel className="text-base font-semibold text-gray-700 gap-1">
                      Votre message
                      <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[200px] text-lg p-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Votre message..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 px-8 text-lg bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg"
                >
                  {isSubmitting ? (
                    "Envoi en cours..."
                  ) : (
                    <>
                      Envoyer
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}