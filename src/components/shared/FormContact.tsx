"use client";

import React, { useState } from "react";
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
import { Send, Loader2, Mail, User, MessageSquare, Tag, ShieldAlert } from "lucide-react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { SuccessMessage } from "./SucessMessage";

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

export default function FormContact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const { toast } = useToast();
  const captchaRef = React.useRef<HCaptcha>(null);

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
    // Vérifier si le captcha a été validé
    if (!captchaToken) {
      setCaptchaError("Veuillez valider le captcha avant d'envoyer le formulaire");
      return;
    }

    setIsSubmitting(true);
    setCaptchaError(null);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          captchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Une erreur est survenue lors de l'envoi du message");
      }

      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
        duration: 5000,
        variant: "default",
        action: <ToastAction altText="Fermer">Fermer</ToastAction>,
      });

      setIsSubmitSuccessful(true);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Une erreur inattendue est survenue";

      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
        action: <ToastAction altText="Réessayer">Réessayer</ToastAction>,
      });

      // Réinitialiser le captcha en cas d'erreur
      if (captchaRef.current) {
        captchaRef.current.resetCaptcha();
      }
      setCaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setIsSubmitSuccessful(false);
    setCaptchaToken(null);
    setCaptchaError(null);
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
  };

  const handleCaptchaChange = (token: string) => {
    setCaptchaToken(token);
    setCaptchaError(null);
  };

  const handleCaptchaError = () => {
    setCaptchaError("Une erreur s'est produite avec le captcha. Veuillez réessayer.");
    setCaptchaToken(null);
  };

  if (isSubmitSuccessful) {
    return <SuccessMessage onReset={handleReset} />;
  }

  return (
    <Card className="shadow-lg border-0 overflow-hidden rounded-xl h-full">
      <CardContent className="p-6 sm:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Grille pour nom et prénom */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      Nom <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 text-base px-4 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="Votre nom"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-500" />
                      Prénom <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 text-base px-4 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="Votre prénom"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Grille pour email et objet */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 text-base px-4 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        type="email"
                        placeholder="votremail@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-blue-500" />
                      Objet <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-11 text-base px-4 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        placeholder="À propos de votre demande..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs mt-1" />
                  </FormItem>
                )}
              />
            </div>

            {/* Champ de message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    Votre message <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[180px] text-base p-4 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-y"
                      placeholder="Décrivez votre demande en détail..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs mt-1" />
                </FormItem>
              )}
            />

            {/* Captcha */}
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center gap-2 self-start mb-2">
                <ShieldAlert className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Vérification de sécurité <span className="text-red-500">*</span>
                </span>
              </div>

              <div className="w-full flex justify-center">
                <HCaptcha
                  ref={captchaRef}
                  sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || ""}
                  onVerify={handleCaptchaChange}
                  onError={handleCaptchaError}
                  theme="light"
                  size="normal"
                  languageOverride="fr"
                />
              </div>

              {captchaError && <div className="text-red-500 text-xs mt-1">{captchaError}</div>}
            </div>

            {/* Bouton d'envoi avec effet visuel */}
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                disabled={isSubmitting || !captchaToken}
                className="w-full h-12 px-6 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Envoyer votre message</span>
                    <Send className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
