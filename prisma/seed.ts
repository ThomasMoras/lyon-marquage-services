// prisma/seed.ts
import { PrismaClient, SectionType } from "@prisma/client";
import { hash } from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash("test", 10);

  const admin = await prisma.user.upsert({
    where: { email: "moras.thomas@gmail.com" },
    update: {},
    create: {
      email: "moras.thomas@gmail.com",
      name: "Administrateur",
      password: adminPassword,
    },
  });

  console.log(`Utilisateur admin créé avec l'ID: ${admin.id}`);

  const cards = [
    {
      title: "Embroidery Design 1",
      description: "Beautiful floral pattern with roses and daisies",
      imageUrl: "/images/embroidery1.jpg",
    },
    {
      title: "Geometric Pattern",
      description: "Modern geometric design with bold colors",
      imageUrl: "/images/embroidery2.jpg",
    },
    {
      title: "Traditional Pattern",
      description: "Classic cross-stitch pattern with folk motifs",
      imageUrl: "/images/embroidery3.jpg",
    },
  ];

  // Home sections
  const homeSections = [
    {
      title: "Notre Histoire",
      description:
        "Depuis plus de 20 ans, nous créons des pièces uniques avec passion et savoir-faire. Notre atelier familial perpétue les traditions tout en embrassant l'innovation.",
      imageUrl: "/images/atelier.jpg",
      imageLeft: true,
      type: SectionType.HOME,
    },
    {
      title: "Artisanat de Qualité",
      description:
        "Chaque pièce est confectionnée à la main avec les meilleurs matériaux. Nous accordons une attention particulière aux détails pour garantir des créations durables.",
      imageUrl: "/images/quality.jpg",
      imageLeft: false,
      type: SectionType.HOME,
    },
    {
      title: "Sur Mesure",
      description:
        "Nous proposons des services personnalisés pour répondre à vos besoins spécifiques. Collaborons ensemble pour créer la pièce de vos rêves.",
      imageUrl: "/images/custom.jpg",
      imageLeft: true,
      type: SectionType.HOME,
    },
    {
      title: "Nos Valeurs",
      description:
        "L'excellence, l'authenticité et le respect de l'environnement guident chacune de nos créations. Nous croyons en un artisanat responsable.",
      imageUrl: "/images/values.jpg",
      imageLeft: false,
      type: SectionType.HOME,
    },
  ];

  // Broderie sections
  const broderieSections = [
    {
      title: "Broderie Traditionnelle",
      description:
        "Découvrez nos techniques ancestrales de broderie, transmises de génération en génération. Chaque point raconte une histoire.",
      imageUrl: "/images/traditional.jpg",
      imageLeft: true,
      type: SectionType.BRODERIE,
    },
    {
      title: "Collections Modernes",
      description:
        "Notre approche contemporaine de la broderie mêle traditions et tendances actuelles pour des créations uniques et innovantes.",
      imageUrl: "/images/modern.jpg",
      imageLeft: false,
      type: SectionType.BRODERIE,
    },
    {
      title: "Matériaux Premium",
      description:
        "Nous sélectionnons avec soin les fils, tissus et accessoires pour garantir des broderies d'exception qui traversent le temps.",
      imageUrl: "/images/materials.jpg",
      imageLeft: true,
      type: SectionType.BRODERIE,
    },
    {
      title: "Ateliers & Formation",
      description:
        "Partagez notre passion en participant à nos ateliers. Apprenez les techniques de broderie dans une ambiance conviviale.",
      imageUrl: "/images/workshop.jpg",
      imageLeft: false,
      type: SectionType.BRODERIE,
    },
  ];

  const carousels = [
    {
      title: "Bienvenue chez Lyon Marquage Service",
      description: "Votre partenaire en marquage textile professionnel",
      image: "/images/home/t_1.jpg",
      buttonText: "Découvrir",
      buttonLink: "/about",
      type: SectionType.HOME,
      order: 1,
    },
    {
      title: "Solutions Personnalisées",
      description: "Des solutions adaptées à vos besoins",
      image: "/images/home/t_2.jpg",
      buttonText: "Nos Services",
      buttonLink: "/services",
      type: SectionType.HOME,
      order: 2,
    },
    {
      title: "Broderie Artisanale",
      description: "Excellence et savoir-faire",
      image: "/images/broderie/b_5.jpg",
      buttonText: "Explorer",
      buttonLink: "/broderie",
      type: SectionType.BRODERIE,
      order: 1,
    },
    {
      title: "Collections Sur Mesure",
      description: "Créations uniques pour votre entreprise",
      image: "/images/broderie/b_7.jpg",
      buttonText: "En savoir plus",
      buttonLink: "/collections",
      type: SectionType.BRODERIE,
      order: 2,
    },
  ];

  // Execute seeds
  for (const card of cards) {
    await prisma.card.create({ data: card });
  }

  for (const section of [...homeSections, ...broderieSections]) {
    await prisma.section.create({ data: section });
  }

  for (const carousel of carousels) {
    await prisma.carousel.create({ data: carousel });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
