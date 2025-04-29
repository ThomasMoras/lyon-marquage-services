import { PrismaClient, SectionType } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Début de la mise à jour des données pour optimisation SEO...");

  // --- MISE À JOUR DES CAROUSELS ---
  const carouselUpdates = [
    // HOME
    {
      id: "cm91rlues0001sr7urep8emom",
      title: "Lyon Marquage - Spécialiste en Marquage Textile à Lyon",
      description:
        "Votre partenaire expert en sérigraphie, broderie, flocage et impression textile à Lyon. Solutions professionnelles pour entreprises et particuliers.",
      buttonText: "Découvrir nos services",
    },
    {
      id: "cm91rlurk0002sr7ul917zl9f",
      title: "Marquage Textile Personnalisé & Objets Publicitaires",
      description:
        "Des solutions sur mesure pour valoriser votre image de marque: sérigraphie sur textile, broderie personnalisée, flocage, signalétique et objets promotionnels",
      buttonText: "Nos Services de Marquage",
    },

    // BRODERIE
    {
      id: "cm91rlv4m0003sr7uomekv8rt",
      title: "Broderie Personnalisée Professionnelle à Lyon",
      description:
        "Excellence et savoir-faire pour vos logos d'entreprise et vêtements professionnels. Service de broderie textile de qualité avec finition premium.",
      buttonText: "Découvrir notre broderie",
    },
    {
      id: "cm91rlvhp0004sr7u25cbqyvh",
      title: "Broderie Textile et Vêtements Professionnels",
      description:
        "Créations uniques pour votre entreprise: broderie logo sur polos, casquettes, vêtements de travail et textiles personnalisés de qualité à Lyon.",
      buttonText: "Voir nos réalisations",
    },

    // SERIGRAPHIE
    {
      id: "cm91rlvuj0005sr7u3yavc557",
      title: "Sérigraphie sur Textile à Lyon - Marquage Professionnel",
      description:
        "Service de sérigraphie textile et sérigraphie publicitaire de qualité exceptionnelle. Impression durable sur t-shirts et vêtements professionnels.",
      buttonText: "Découvrir notre sérigraphie",
    },
    {
      id: "cm91rlw7b0006sr7uee6pr0yn",
      title: "Sérigraphie Tee-shirt et Transfert Sérigraphique",
      description:
        "Reproduction fidèle de vos logos et designs avec notre service de sérigraphie professionnelle. Résistance exceptionnelle pour vos textiles d'entreprise.",
      buttonText: "Nos Réalisations en Sérigraphie",
    },

    // IMPRESSION
    {
      id: "cm91rlwk50007sr7um1qo21p7",
      title: "Impression sur Textile et Tee-shirt à Lyon",
      description:
        "Impression numérique de haute qualité pour vos projets personnalisés. Service rapide et précis d'impression sur tee-shirt et textiles promotionnels.",
      buttonText: "Explorer nos services d'impression",
    },
    {
      id: "cm91rlwx90008sr7uzfwqv7pm",
      title: "Impression Directe et Impression Personnalisée",
      description:
        "Solutions d'impression textile polyvalentes pour tous supports et formats. Impression numérique haute définition pour vos besoins professionnels.",
      buttonText: "Nos Services d'Impression",
    },

    // FLOCAGE
    {
      id: "cm91rlxa30009sr7u2dz5nb0o",
      title: "Flocage Textile et Marquage Velours à Lyon",
      description:
        "Service de flocage textile premium avec texture unique et toucher velouté. Personnalisation de vêtements professionnels et sportifs de qualité.",
      buttonText: "Découvrir notre flocage",
    },
    {
      id: "cm91rlxmw000asr7ub968ycwd",
      title: "Flocage Personnalisé pour Équipements Sportifs",
      description:
        "Flocage vêtement spécialisé pour clubs et équipes sportives. Marquage textile résistant pour numéros, noms et logos sur maillots et équipements.",
      buttonText: "Solutions pour le Sport",
    },

    // OBJETS PUBLICITAIRES
    {
      id: "cm91rlxzn000bsr7u60jc4rur",
      title: "Objets Publicitaires et Goodies Entreprise à Lyon",
      description:
        "Renforcez votre image de marque avec notre sélection d'objets publicitaires personnalisés. Marquage publicitaire professionnel pour vos goodies d'entreprise.",
      buttonText: "Voir notre collection",
    },
    {
      id: "cm91rlyce000csr7ut0ohlz6r",
      title: "Kakemonos, Totems et Objets Promotionnels",
      description:
        "Cadeaux d'entreprise et supports publicitaires pour marquer les esprits durablement. Solutions complètes de marquage publicitaire pour vos opérations marketing.",
      buttonText: "Nos Solutions Publicitaires",
    },

    // ENSEIGNES
    {
      id: "cm91rlyp8000dsr7u0f4hsk7w",
      title: "Enseignes et Lettrage Adhésif à Lyon",
      description:
        "Solutions professionnelles d'enseignes et totems pour une visibilité maximale de votre activité. Fabrication et installation de signalétique commerciale.",
      buttonText: "Nos Solutions d'Enseignes",
    },
    {
      id: "cm91rlz22000esr7u9oduw79c",
      title: "Marquage de Véhicule et Habillage de Façade",
      description:
        "Signalétique intérieure et extérieure professionnelle. Solutions complètes de lettrage adhésif et marquage véhicule pour votre communication visuelle.",
      buttonText: "En savoir plus",
    },

    // IMPRIMERIE
    {
      id: "cm91rlzet000fsr7u44s45k9m",
      title: "Imprimerie Professionnelle à Lyon - Impression Directe",
      description:
        "Services d'impression de qualité, de la carte de visite aux bâches grand format. Imprimerie complète pour tous vos besoins de communication imprimée.",
      buttonText: "Découvrir nos Services d'Imprimerie",
    },
    {
      id: "cm91rlzrl000gsr7usyhl0er1",
      title: "Impression Kakemonos et Documents Marketing",
      description:
        "Brochures, flyers, lettres adhésives et supports marketing professionnels. Solutions d'impression complètes pour votre communication d'entreprise.",
      buttonText: "Demander un Devis",
    },
  ];

  // --- MISE À JOUR DES SECTIONS ---
  const sectionUpdates = [
    // SECTION SERIGRAPHIE
    {
      title: "L'expertise en sérigraphie sur textile à Lyon",
      newTitle: "L'expertise en sérigraphie sur textile à Lyon",
      description:
        "Notre atelier de sérigraphie à Lyon propose un service professionnel d'impression textile reconnu pour sa qualité exceptionnelle. Cette technique d'impression traditionnelle allie couleurs éclatantes, rendu visuel précis et durabilité exceptionnelle, le tout à des prix compétitifs pour les moyennes et grandes séries. Spécialistes de la sérigraphie sur tee-shirt et textiles professionnels, nous garantissons des résultats impeccables.",
      type: SectionType.SERIGRAPHIE,
      imageLeft: true,
      order: 0,
    },
    {
      title: "Comment fonctionne la sérigraphie",
      newTitle: "Processus de sérigraphie professionnelle",
      description:
        "La sérigraphie repose sur le principe du pochoir. Dans notre atelier près de Lyon, nous créons un écran imperméable pour chaque couleur de votre design, qui est placé entre l'encre et le textile, ne laissant passer l'encre qu'à travers les zones correspondant à votre motif. Cette technique de sérigraphie publicitaire permet un dépôt d'encre optimal directement sur le tissu, suivi d'un séchage à haute température pour une fixation parfaite.",
      type: SectionType.SERIGRAPHIE,
      imageLeft: false,
      order: 1,
    },
    {
      title: "Durabilité exceptionnelle",
      newTitle: "Durabilité exceptionnelle de la sérigraphie textile",
      description:
        "Technique d'impression textile la plus éprouvée, la sérigraphie offre un marquage de haute qualité qui résiste au temps et aux lavages répétés. L'encre pénètre profondément dans les fibres, ce qui en fait la solution idéale pour les vêtements de travail, les tee-shirts d'entreprise ou les équipements sportifs. Notre service de sérigraphie à Lyon garantit des impressions durables qui conservent leur éclat même après de nombreux cycles de lavage.",
      type: SectionType.SERIGRAPHIE,
      imageLeft: true,
      order: 2,
    },
    {
      title: "Fidélité des couleurs",
      newTitle: "Sérigraphie et transfert sérigraphique",
      description:
        "En complément de la sérigraphie directe, nous proposons également le transfert sérigraphique, une technique qui offre une grande flexibilité. Cette méthode consiste à imprimer d'abord le motif sérigraphié sur un papier spécial, puis à le transférer sur le textile par thermocollage. Particulièrement adaptée aux petites séries ou aux designs complexes, cette technique conserve tous les avantages de la sérigraphie traditionnelle avec une mise en œuvre plus souple.",
      type: SectionType.SERIGRAPHIE,
      imageLeft: false,
      order: 3,
    },

    // SECTION BRODERIE
    {
      title: "Broderie Traditionnelle",
      newTitle: "Broderie personnalisée de qualité à Lyon",
      description:
        "Notre atelier de broderie à Lyon perpétue des techniques ancestrales tout en les adaptant aux besoins modernes. Chaque broderie personnalisée est réalisée avec précision et minutie, permettant à votre logo ou design de se démarquer avec élégance. Notre expertise en broderie textile professionnelle garantit un rendu premium et une durabilité exceptionnelle pour tous vos vêtements d'entreprise et projets textiles personnalisés.",
      type: SectionType.BRODERIE,
      imageLeft: true,
      order: 0,
    },
    {
      title: "Collections Modernes",
      newTitle: "Broderie moderne et textile professionnel",
      description:
        "Notre approche contemporaine de la broderie allie traditions séculaires et technologies actuelles pour des créations uniques et innovantes. Spécialistes de la broderie sur vêtements professionnels, nous réalisons votre logo d'entreprise, vos écussons ou monogrammes avec une finition impeccable. La broderie apporte une valeur ajoutée indéniable à vos textiles en créant un effet relief élégant et distinctif qui valorise votre image de marque.",
      type: SectionType.BRODERIE,
      imageLeft: false,
      order: 1,
    },
    {
      title: "Matériaux Premium",
      newTitle: "Matériaux premium pour une broderie de qualité",
      description:
        "La qualité d'une broderie textile dépend grandement des matériaux utilisés. C'est pourquoi nous sélectionnons avec soin les fils, tissus et accessoires pour garantir des broderies personnalisées d'exception qui traversent le temps. Notre large gamme de fils haute résistance dans plus de 200 coloris permet de reproduire fidèlement vos logos et designs les plus exigeants avec une précision incomparable et des couleurs éclatantes.",
      type: SectionType.BRODERIE,
      imageLeft: true,
      order: 2,
    },
    {
      title: "Ateliers & Formation",
      newTitle: "Service complet de broderie à Lyon",
      description:
        "Notre atelier de broderie à Lyon vous accompagne de la conception à la réalisation. Nous digitalisons votre logo pour l'adapter parfaitement à la broderie, puis réalisons des échantillons pour validation avant production. Notre équipement professionnel nous permet de broder efficacement petites et grandes séries de vêtements personnalisés. Entreprises, associations, écoles... faites confiance à notre expertise en broderie professionnelle pour sublimer vos textiles.",
      type: SectionType.BRODERIE,
      imageLeft: false,
      order: 3,
    },

    // SECTION IMPRESSION
    {
      title: "Impression numérique haute définition",
      newTitle: "Impression textile numérique haute définition",
      description:
        "Notre technologie d'impression textile numérique offre une résolution exceptionnelle et une reproduction fidèle des couleurs pour tous vos projets d'impression sur tee-shirt et supports textiles. Cette technique moderne permet d'imprimer des designs complexes, des dégradés et même des photographies en haute définition directement sur le textile, avec un résultat précis et des couleurs vibrantes qui résistent au lavage.",
      type: SectionType.IMPRESSION,
      imageLeft: true,
      order: 0,
    },
    {
      title: "Flexibilité et réactivité",
      newTitle: "Impression sur tee-shirt personnalisée",
      description:
        "L'impression numérique permet de réaliser des tee-shirts personnalisés en toutes quantités, même à l'unité, sans compromettre la qualité. Cette flexibilité est idéale pour vos projets d'impression textile urgents, vos petites séries personnalisées ou vos prototypes. Notre service d'impression sur tee-shirt à Lyon vous garantit un rendu professionnel, même pour les commandes les plus modestes, avec des délais rapides et des prix compétitifs.",
      type: SectionType.IMPRESSION,
      imageLeft: false,
      order: 1,
    },
    {
      title: "Variété de supports",
      newTitle: "Variété de supports pour l'impression directe",
      description:
        "Notre technologie d'impression directe s'adapte à une multitude de textiles et matériaux : coton, polyester, mélanges, textiles techniques... Notre parc machines de dernière génération nous permet de réaliser des impressions personnalisées sur tee-shirts, polos, sweats, sacs en tissu et bien d'autres supports. Cette polyvalence fait de l'impression textile numérique une solution adaptable à tous vos projets de personnalisation.",
      type: SectionType.IMPRESSION,
      imageLeft: true,
      order: 2,
    },
    {
      title: "Éco-responsabilité",
      newTitle: "Impression textile éco-responsable",
      description:
        "Notre engagement pour l'environnement se traduit par l'utilisation d'encres à base d'eau et de pratiques d'impression textile respectueuses. Ces encres écologiques garantissent des résultats durables et résistants aux UV tout en limitant l'impact environnemental. Choisir notre service d'impression sur tee-shirt à Lyon, c'est opter pour une personnalisation textile responsable sans compromis sur la qualité et la longévité des impressions.",
      type: SectionType.IMPRESSION,
      imageLeft: false,
      order: 3,
    },

    // SECTION FLOCAGE
    {
      title: "Le flocage textile",
      newTitle: "Service de flocage textile professionnel à Lyon",
      description:
        "Le flocage textile est une technique de marquage qui offre un rendu velouté unique et une texture agréable au toucher. Notre service de flocage à Lyon consiste à appliquer des fibres textiles sur un support adhésif pour créer des motifs en relief qui se distinguent par leur aspect premium. Cette méthode de personnalisation est particulièrement appréciée pour les logos d'entreprise, les numéros et noms sur équipements sportifs, et les vêtements promotionnels haut de gamme.",
      type: SectionType.FLOCAGE,
      imageLeft: true,
      order: 0,
    },
    {
      title: "Applications sportives",
      newTitle: "Flocage sport et équipements sportifs",
      description:
        "Particulièrement apprécié dans le domaine sportif, le flocage textile permet de réaliser des numéros et noms de joueurs résistants aux conditions intensives et aux lavages fréquents. Notre atelier à Lyon est équipé pour répondre aux besoins spécifiques des clubs sportifs, avec un flocage personnalisé qui respecte les normes et réglementations des différentes fédérations. Maillots, shorts, survêtements... nous garantissons un marquage textile durable et de qualité pour tous vos équipements.",
      type: SectionType.FLOCAGE,
      imageLeft: false,
      order: 1,
    },
    {
      title: "Personnalisation d'entreprise",
      newTitle: "Flocage vêtement pour entreprises",
      description:
        "Valorisez votre image de marque avec des vêtements professionnels floqués à votre effigie. Le flocage textile offre un rendu haut de gamme pour vos logos et slogans d'entreprise, créant une identité visuelle forte et cohérente. Cette technique de marquage textile est idéale pour les uniformes, les vêtements corporate et les tenues d'équipe, apportant une touche d'élégance et de professionnalisme à vos vêtements personnalisés.",
      type: SectionType.FLOCAGE,
      imageLeft: true,
      order: 2,
    },
    {
      title: "Variété de textures et couleurs",
      newTitle: "Variété de textures et couleurs pour flocage personnalisé",
      description:
        "Notre catalogue propose une large gamme de textures et couleurs de flocage pour répondre à toutes vos envies créatives et contraintes techniques. Du flocage mat au flocage pailleté, en passant par les effets métallisés ou fluorescents, nous offrons de nombreuses possibilités pour personnaliser vos textiles. Notre expertise en flocage vêtement à Lyon nous permet de vous conseiller sur les meilleures combinaisons de couleurs et textures pour un résultat optimal.",
      type: SectionType.FLOCAGE,
      imageLeft: false,
      order: 3,
    },

    // SECTION OBJETS_PUBLICITAIRES
    {
      title: "Communication par l'objet",
      newTitle: "Objets publicitaires personnalisés à Lyon",
      description:
        "Les objets publicitaires constituent un support de communication efficace et durable pour votre entreprise. Notre service de marquage publicitaire à Lyon vous propose des goodies personnalisés utiles qui rappelleront votre marque au quotidien. Du stylo au mug, en passant par les textiles promotionnels, chaque objet publicitaire devient un ambassadeur de votre entreprise, diffusant votre message auprès de vos clients et prospects avec un excellent retour sur investissement.",
      type: SectionType.OBJETS_PUBLICITAIRES,
      imageLeft: true,
      order: 0,
    },
    {
      title: "Catalogue diversifié",
      newTitle: "Catalogue complet de goodies entreprise",
      description:
        "De la papeterie aux textiles, en passant par les accessoires high-tech, notre catalogue d'objets publicitaires à Lyon couvre tous les besoins et toutes les occasions. Nous proposons une sélection complète de goodies entreprise pour vos événements, salons professionnels, cadeaux clients ou opérations marketing. Notre expertise en objets promotionnels nous permet de vous recommander les produits les plus adaptés à votre cible, votre budget et vos objectifs de communication.",
      type: SectionType.OBJETS_PUBLICITAIRES,
      imageLeft: false,
      order: 1,
    },
    {
      title: "Personnalisation sur mesure",
      newTitle: "Personnalisation d'objets publicitaires sur mesure",
      description:
        "Chaque objet peut être personnalisé selon vos spécifications : sérigraphie, gravure, impression numérique, broderie, doming... Nos experts en marquage publicitaire à Lyon vous conseillent sur la technique la plus adaptée à chaque support pour un résultat optimal. Du totebag au powerbank, en passant par les clés USB et les carnets, nous garantissons un marquage de qualité qui met en valeur votre logo et renforce l'identité visuelle de votre entreprise.",
      type: SectionType.OBJETS_PUBLICITAIRES,
      imageLeft: true,
      order: 2,
    },
    {
      title: "Sélection éco-responsable",
      newTitle: "Objets publicitaires éco-responsables",
      description:
        "Découvrez notre gamme d'objets publicitaires écologiques, fabriqués à partir de matériaux recyclés ou biodégradables, pour une communication respectueuse de l'environnement. Ces goodies entreprise durables reflètent votre engagement RSE tout en offrant une image positive de votre marque. Stylos en papier recyclé, mugs en bambou, totebags en coton bio... nos objets promotionnels éco-responsables combinent utilité, éthique et efficacité publicitaire.",
      type: SectionType.OBJETS_PUBLICITAIRES,
      imageLeft: false,
      order: 3,
    },

    // SECTION ENSEIGNES
    {
      title: "Enseignes commerciales",
      newTitle: "Enseignes commerciales et totems à Lyon",
      description:
        "Démarquez-vous avec une enseigne lumineuse, un totem publicitaire ou une vitrophanie qui captent l'attention et renforcent l'identité visuelle de votre établissement. Notre atelier de fabrication d'enseignes à Lyon conçoit, réalise et installe des solutions signalétiques personnalisées qui augmentent votre visibilité et valorisent votre image de marque. Du commerce de proximité à la grande surface, nous créons des enseignes adaptées à votre activité et à votre environnement.",
      type: SectionType.ENSEIGNES,
      imageLeft: true,
      order: 0,
    },
    {
      title: "Signalétique intérieure",
      newTitle: "Signalétique intérieure et lettrage adhésif",
      description:
        "Orientez vos visiteurs avec élégance grâce à notre gamme de solutions de signalétique intérieure : plaques de porte, panneaux directionnels, lettrage adhésif et affichages réglementaires. Notre service d'enseignes à Lyon crée une cohérence visuelle entre votre extérieur et votre intérieur, renforçant ainsi votre identité de marque. Du bureau à l'espace commercial, nous concevons une signalétique claire et esthétique qui améliore l'expérience client et l'orientation dans vos locaux.",
      type: SectionType.ENSEIGNES,
      imageLeft: false,
      order: 1,
    },
    {
      title: "Signalétique extérieure",
      newTitle: "Signalétique extérieure et totems publicitaires",
      description:
        "Panneaux, totems publicitaires, drapeaux... Notre signalétique extérieure résiste aux intempéries tout en garantissant une visibilité optimale, jour et nuit. Nous utilisons des matériaux durables et des techniques d'impression résistantes aux UV pour assurer la longévité de vos enseignes à Lyon. Nos totems et panneaux sur pied offrent une solution idéale pour les commerces en retrait de la rue ou situés dans des zones d'activité, améliorant significativement votre visibilité.",
      type: SectionType.ENSEIGNES,
      imageLeft: true,
      order: 2,
    },
    {
      title: "Habillage de véhicules",
      newTitle: "Marquage de véhicule et flotte professionnelle",
      description:
        "Transformez vos véhicules en supports publicitaires mobiles avec nos solutions de marquage de véhicule partial ou total, réalisées avec des matériaux résistants et adaptés. Votre flotte professionnelle devient un véritable média publicitaire itinérant, diffusant votre message dans toute la région lyonnaise. Notre expertise en habillage adhésif pour véhicules garantit un rendu professionnel, une pose parfaite et une durabilité optimale, même dans des conditions d'utilisation intensives.",
      type: SectionType.ENSEIGNES,
      imageLeft: false,
      order: 3,
    },

    // SECTION IMPRIMERIE
    {
      title: "Documents professionnels",
      newTitle: "Imprimerie professionnelle à Lyon",
      description:
        "Notre service d'imprimerie à Lyon réalise tous vos documents professionnels : cartes de visite, papier à en-tête, chemises à rabats, plaquettes commerciales... Chaque support est imprimé avec soin sur des papiers de qualité sélectionnés pour véhiculer une image impeccable de votre entreprise. Nos techniques d'impression directe et notre finition soignée garantissent des documents professionnels qui reflètent l'excellence de votre activité et renforcent votre crédibilité.",
      type: SectionType.IMPRIMERIE,
      imageLeft: true,
      order: 0,
    },
    {
      title: "Marketing imprimé",
      newTitle: "Supports marketing et communication imprimée",
      description:
        "Flyers, brochures, catalogues, affiches... Nos supports marketing imprimés captent l'attention et transmettent efficacement votre message commercial. Notre imprimerie à Lyon maîtrise toutes les techniques d'impression et de façonnage pour créer des documents marketing percutants. De la conception graphique à la livraison, nous vous accompagnons dans la création de supports de communication qui génèrent de l'impact et déclenchent l'action auprès de vos prospects et clients.",
      type: SectionType.IMPRIMERIE,
      imageLeft: false,
      order: 1,
    },
    {
      title: "Événementiel",
      newTitle: "Impression pour événements et communication",
      description:
        "Invitations, programmes, menus, badges... Notre imprimerie produit tous les supports imprimés pour faire de votre événement un moment mémorable, avec des finitions élégantes et soignées. Que vous organisiez un séminaire d'entreprise, une inauguration ou un salon professionnel, nos solutions d'impression événementielle à Lyon vous permettent de soigner chaque détail de votre communication et de créer une expérience cohérente pour vos participants.",
      type: SectionType.IMPRIMERIE,
      imageLeft: true,
      order: 2,
    },
    {
      title: "Grands formats",
      newTitle: "Impression grand format et kakemonos",
      description:
        "Bâches publicitaires, kakemonos, roll-ups, panneaux rigides... Notre parc machine grand format vous permet de créer un impact visuel maximal pour vos communications événementielles et promotionnelles. Notre expertise en impression de kakemonos et bâches publicitaires à Lyon garantit des visuels de grande qualité, résistants et adaptés à tous les environnements, intérieurs comme extérieurs. Ces supports grand format captent l'attention et maximisent la visibilité de votre message.",
      type: SectionType.IMPRIMERIE,
      imageLeft: false,
      order: 3,
    },
  ];

  // Mettre à jour les carousels
  console.log("Mise à jour des carousels...");
  let updatedCarousels = 0;

  for (const update of carouselUpdates) {
    try {
      await prisma.carousel.update({
        where: { id: update.id },
        data: {
          title: update.title,
          description: update.description,
          buttonText: update.buttonText,
        },
      });
      updatedCarousels++;
      console.log(`Carousel mis à jour: ${update.title}`);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du carousel ${update.id}:`, error);
    }
  }

  // Mettre à jour les sections
  console.log("\nMise à jour des sections...");
  let updatedSections = 0;

  for (const update of sectionUpdates) {
    try {
      // Trouver la section à mettre à jour
      const sections = await prisma.section.findMany({
        where: {
          type: update.type,
          title: update.title,
        },
      });

      if (sections.length > 0) {
        // Mettre à jour la première section trouvée
        await prisma.section.update({
          where: { id: sections[0].id },
          data: {
            title: update.newTitle,
            description: update.description,
          },
        });
        updatedSections++;
        console.log(`Section mise à jour: ${update.newTitle}`);
      } else {
        console.log(`Section non trouvée: ${update.title} (type: ${update.type})`);
      }
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la section ${update.title}:`, error);
    }
  }

  console.log("\nRésumé des mises à jour:");
  console.log(`- Carousels: ${updatedCarousels}/${carouselUpdates.length} mis à jour`);
  console.log(`- Sections: ${updatedSections}/${sectionUpdates.length} mises à jour`);
  console.log("\nMise à jour des données terminée !");
}

main()
  .catch((e) => {
    console.error("Erreur lors de la mise à jour des données:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
