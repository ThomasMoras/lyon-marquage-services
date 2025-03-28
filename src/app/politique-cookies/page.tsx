import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de cookies | Lyon Marquage Service",
  description: "Notre politique concernant l&apos;utilisation des cookies sur notre site web.",
};

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col my-32 mx-10">
      <h1 className="text-3xl font-bold mb-8">Politique de cookies</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Qu&apos;est-ce qu&apos;un cookie ?</h2>
        <p className="mb-4">
          Un cookie est un petit fichier texte qui peut être placé sur votre appareil lorsque vous
          visitez un site web. Les cookies sont largement utilisés pour faire fonctionner les sites
          web ou les rendre plus efficaces, ainsi que pour fournir des informations aux
          propriétaires du site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Comment utilisons-nous les cookies ?</h2>
        <p className="mb-4">
          Notre site utilise différents types de cookies pour diverses raisons :
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Cookies nécessaires :</strong> Ces cookies sont essentiels au fonctionnement de
            notre site web. Ils vous permettent de naviguer sur le site et d&apos;utiliser ses
            fonctionnalités, comme l&apos;accès aux zones sécurisées. Sans ces cookies, certains
            services que vous avez demandés ne peuvent pas être fournis.
          </li>
          <li>
            <strong>Cookies de préférences :</strong> Ces cookies nous permettent de mémoriser vos
            choix (comme votre nom d&apos;utilisateur, la langue ou la région où vous vous trouvez)
            et de fournir des fonctionnalités améliorées et plus personnalisées. Ils peuvent
            également être utilisés pour mémoriser les changements que vous avez apportés à la
            taille du texte, aux polices et à d&apos;autres parties des pages web que vous pouvez
            personnaliser.
          </li>
          <li>
            <strong>Cookies statistiques :</strong> Ces cookies nous aident à comprendre comment les
            visiteurs interagissent avec notre site en collectant et en rapportant des informations
            de manière anonyme. Ils nous aident à améliorer la façon dont notre site fonctionne.
          </li>
          <li>
            <strong>Cookies marketing :</strong> Ces cookies sont utilisés pour suivre les visiteurs
            sur les sites web. L&apos;intention est d&apos;afficher des publicités qui sont
            pertinentes et attrayantes pour l&apos;utilisateur individuel et donc plus précieuses
            pour les éditeurs et les annonceurs tiers.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Comment gérer vos cookies</h2>
        <p className="mb-4">
          Vous pouvez modifier vos préférences en matière de cookies à tout moment en cliquant sur
          le bouton &quot;Paramètres des cookies&quot; situé en bas de notre site. Vous pouvez
          également choisir d&apos;accepter ou de refuser les cookies en modifiant les paramètres de
          votre navigateur. Veuillez noter que la désactivation de certains cookies peut affecter
          votre expérience sur notre site web.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Cookies que nous utilisons</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Nom du cookie</th>
                <th className="py-2 px-4 border-b text-left">Finalité</th>
                <th className="py-2 px-4 border-b text-left">Durée de conservation</th>
                <th className="py-2 px-4 border-b text-left">Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">next-auth.session-token</td>
                <td className="py-2 px-4 border-b">
                  Gestion des sessions administrateur uniquement
                </td>
                <td className="py-2 px-4 border-b">Session</td>
                <td className="py-2 px-4 border-b">Nécessaire (zone admin)</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">theme</td>
                <td className="py-2 px-4 border-b">Préférence de thème (clair/sombre)</td>
                <td className="py-2 px-4 border-b">1 an</td>
                <td className="py-2 px-4 border-b">Préférence</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">cookie_consent</td>
                <td className="py-2 px-4 border-b">Stocke vos préférences en matière de cookies</td>
                <td className="py-2 px-4 border-b">6 mois</td>
                <td className="py-2 px-4 border-b">Nécessaire</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Mise à jour de notre politique de cookies</h2>
        <p>
          Nous pouvons mettre à jour notre politique de cookies de temps à autre. Nous vous
          encourageons donc à consulter régulièrement cette page pour rester informé des
          modifications apportées. Cette politique de cookies a été mise à jour pour la dernière
          fois le [DATE].
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact</h2>
        <p>
          Si vous avez des questions concernant notre politique de cookies, veuillez nous contacter
          à l&apos;adresse suivante : [VOTRE ADRESSE EMAIL].
        </p>
      </section>
    </div>
  );
}
