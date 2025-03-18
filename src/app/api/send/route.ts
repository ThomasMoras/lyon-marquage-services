import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Schéma de validation avec captcha
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
  captchaToken: z.string().min(1, "Le token captcha est requis"),
});

// Fonction pour vérifier le token captcha
async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    if (!process.env.HCAPTCHA_SECRET_KEY) {
      console.error("HCAPTCHA_SECRET_KEY n'est pas définie dans les variables d'environnement");
      return false;
    }

    const response = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "secret": process.env.HCAPTCHA_SECRET_KEY || "",
        "response": token,
      }),
    });

    const data = await response.json();

    // Journaliser la réponse pour le débogage (à supprimer en production)
    if (process.env.NODE_ENV !== "production") {
      console.log("Réponse captcha:", data);
    }

    return data.success === true;
  } catch (error) {
    console.error("Erreur lors de la vérification du captcha:", error);
    return false;
  }
}

// Stockage simple pour le rate limiting (en production, utilisez Redis)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 5;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.ip || "unknown";
    const now = Date.now();
    const requestLog = rateLimitMap.get(ip) || [];
    const recentRequests = requestLog.filter((time: number) => now - time < RATE_LIMIT_WINDOW);

    if (recentRequests.length >= MAX_REQUESTS) {
      return NextResponse.json(
        { message: "Trop de requêtes, veuillez réessayer plus tard" },
        { status: 429 }
      );
    }

    // Mise à jour du log de requêtes
    rateLimitMap.set(ip, [...recentRequests, now]);

    // Récupérer et valider les données
    const body = await request.json();
    const validatedData = formSchema.parse(body);

    // Vérifier le captcha
    const isCaptchaValid = await verifyCaptcha(validatedData.captchaToken);
    if (!isCaptchaValid) {
      return NextResponse.json(
        { message: "Échec de la vérification du captcha. Veuillez réessayer." },
        { status: 400 }
      );
    }

    // Configurer le transporteur d'email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_PORT === "465", // true pour le port 465, false pour les autres ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Construction du contenu de l'email
    const emailContent = `
      <h2>Nouveau message du formulaire de contact de Lyon Marquage</h2>
      <p><strong>De:</strong> ${validatedData.firstName} ${validatedData.lastName} (${
      validatedData.email
    })</p>
      <p><strong>Objet:</strong> ${validatedData.subject}</p>
      <h3>Message:</h3>
      <p>${validatedData.message.replace(/\n/g, "<br>")}</p>
      <hr>
      <p><em>Ce message a été envoyé depuis le formulaire de contact du site Lyon Marquage (lyonmarquage.fr)</em></p>
      <p><small>IP: ${ip} - Date: ${new Date().toLocaleString("fr-FR")}</small></p>
    `;

    // Options pour l'envoi de l'email
    const mailOptions = {
      from: `"Formulaire Lyon Marquage" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: validatedData.email,
      subject: `Contact site web: ${validatedData.subject}`,
      html: emailContent,
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    // Réponse en cas de succès
    return NextResponse.json({ message: "Email envoyé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);

    // Gestion des erreurs de validation
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation échouée", errors: error.errors },
        { status: 400 }
      );
    }

    // Gestion des autres erreurs
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
