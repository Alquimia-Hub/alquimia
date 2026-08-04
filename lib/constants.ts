export const SITE_CONTENT = {
  brand: "Alquimia",
  year: "Anno MMXXVI",

  nav: {
    marca: "Marca",
  },

  hero: {
    eyebrow: "Comunidad Abierta",
    title: "Alquim",
    titleAccent: "ia",
    titleSrSuffix: " — Comunidad abierta sobre IA y productividad",
    subtitle:
      "Una comunidad abierta y gratuita donde compartimos conocimiento sobre inteligencia artificial, automatización y productividad.",
  },

  cta: {
    button: "Unirse al Discord",
    whatsappButton: "Unirse al WhatsApp",
    note: "entrada abierta",
    discordUrl: "https://discord.gg/wkhHrWZC3Q",
    whatsappUrl: "https://chat.whatsapp.com/BhC5waw0nm1FIRSb9Kvs7a",
  },

  pillars: [
    {
      id: "inteligencia",
      title: "Inteligencia",
      description: "modelos · papers · prompts",
    },
    {
      id: "automatizacion",
      title: "Automatización",
      description: "flujos · agentes · integraciones",
    },
    {
      id: "productividad",
      title: "Productividad",
      description: "sistemas · hábitos · métodos",
    },
  ],

  quote: {
    text: "La tragedia de la vida es que nos hacemos viejos demasiado pronto y sabios demasiado tarde.",
    author: "Benjamin Franklin",
  },

  footer: {
    tagline: "Alquimia — comunidad de artes modernas",
    year: "· MMXXVI ·",
    craft: "Forjada con tinta y paciencia",
    marca: "Marca",
  },

  brandPage: {
    eyebrow: "Identidad",
    title: "Marca",
    subtitle:
      "Los elementos visuales de Alquimia. Descarga el logo, copia los colores y consulta la tipografía.",
    sections: {
      logo: "Logo",
      colors: "Colores",
      typography: "Tipografía",
    },
    logoVariants: {
      icon: {
        name: "Símbolo",
        desc: "Solo el sigilo, para íconos y avatares.",
      },
      horizontal: {
        name: "Horizontal",
        desc: "Símbolo y nombre en línea — la marca principal.",
      },
      stacked: {
        name: "Apilado",
        desc: "Composición cuadrada para redes y perfiles.",
      },
      wordmark: {
        name: "Logotipo",
        desc: "Solo el nombre, en su grabado original.",
      },
    },
    actions: {
      downloadSvg: "SVG",
      downloadPng: "PNG",
      copySvg: "Copiar SVG",
      copyMarkup: "Copiar código",
      copy: "Copiar",
      copied: "Copiado",
      size: "Tamaño",
      color: "Color",
      viewBrand: "Ver marca",
      downloadPngLight: "Claro",
      downloadPngDark: "Oscuro",
    },
    colorGroups: {
      backgrounds: "Fondos",
      ink: "Tinta",
      accents: "Acentos",
    },
    typographyRoles: {
      display: "Display",
      body: "Texto",
      ornament: "Ornamento",
      mono: "Mono",
    },
    pangram: "El veloz murciélago hindú comía feliz cardillo y kiwi.",
    aaLabel: "AA",
    aaaLabel: "AAA",
    decorativeLabel: "decorativo",
    googleFontsLabel: "Google Fonts",
  },
} as const;
