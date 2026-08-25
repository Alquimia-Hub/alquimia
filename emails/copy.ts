export type EmailLocale = "es" | "en";

export const DEFAULT_EMAIL_LOCALE: EmailLocale = "es";

export const EMAIL_COPY = {
  es: {
    common: {
      preview: "Alquimia Launchpad",
      footer: "Te llega este mail porque tenes una cuenta en Alquimia.",
      siteUrl: "https://alquimia.community",
      viewProject: "Ver proyecto",
    },
    welcome: {
      subject: "Bienvenido a Alquimia Launchpad",
      heading: "Bienvenido a Alquimia",
      body: "Ya podes publicar tu proyecto en el Launchpad y apoyar los del resto de la comunidad.",
      alquimista:
        "Verifica tu cuenta de Discord para conseguir el badge de Alquimista: tus votos pasan a valer el triple.",
      cta: "Ir al Launchpad",
      discordCta: "Unirme al Discord",
    },
    approved: {
      subject: (name: string) => `${name} ya esta publicado en el Launchpad`,
      heading: "Tu proyecto fue aprobado",
      body: (name: string) =>
        `${name} ya es visible para toda la comunidad. Compartilo para sumar apoyos.`,
      cta: "Ver mi proyecto",
    },
    rejected: {
      subject: (name: string) => `Revisamos ${name} y necesita cambios`,
      heading: "Tu proyecto necesita cambios",
      body: (name: string) =>
        `Revisamos ${name} y todavia no lo podemos publicar. El motivo:`,
      cta: "Editar mi proyecto",
      note: "Corregilo y volve a enviarlo: lo revisamos de nuevo.",
    },
    adminSubmission: {
      subject: (name: string) => `Nuevo proyecto en la cola: ${name}`,
      resubmissionSubject: (name: string) => `Vuelve a la cola: ${name}`,
      heading: "Proyecto nuevo para revisar",
      resubmissionHeading: "Un proyecto editado volvio a la cola",
      by: "Enviado por",
      cta: "Abrir el panel",
    },
  },
  en: {
    common: {
      preview: "Alquimia Launchpad",
      footer: "You are receiving this because you have an Alquimia account.",
      siteUrl: "https://alquimia.community",
      viewProject: "View project",
    },
    welcome: {
      subject: "Welcome to Alquimia Launchpad",
      heading: "Welcome to Alquimia",
      body: "You can now publish your project on the Launchpad and support everyone else's.",
      alquimista:
        "Verify your Discord account to earn the Alquimista badge: your votes count triple.",
      cta: "Go to the Launchpad",
      discordCta: "Join the Discord",
    },
    approved: {
      subject: (name: string) => `${name} is now live on the Launchpad`,
      heading: "Your project was approved",
      body: (name: string) =>
        `${name} is now visible to the whole community. Share it to gather support.`,
      cta: "View my project",
    },
    rejected: {
      subject: (name: string) => `We reviewed ${name} and it needs changes`,
      heading: "Your project needs changes",
      body: (name: string) =>
        `We reviewed ${name} and can't publish it yet. Here's why:`,
      cta: "Edit my project",
      note: "Fix it and submit again: we'll review it right away.",
    },
    adminSubmission: {
      subject: (name: string) => `New project in the queue: ${name}`,
      resubmissionSubject: (name: string) => `Back in the queue: ${name}`,
      heading: "New project to review",
      resubmissionHeading: "An edited project is back in the queue",
      by: "Submitted by",
      cta: "Open the panel",
    },
  },
} as const;

export function emailCopy(locale: EmailLocale | undefined) {
  return EMAIL_COPY[locale ?? DEFAULT_EMAIL_LOCALE] ?? EMAIL_COPY.es;
}

export function emailLocale(locale: EmailLocale | undefined): EmailLocale {
  return locale && locale in EMAIL_COPY ? locale : DEFAULT_EMAIL_LOCALE;
}
