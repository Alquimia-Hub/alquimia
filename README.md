# alquimia

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_AxTLTQMJQ9VrBpboc8X5pM0TyVlc)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/[locale]/page.tsx`. The page auto-updates as you edit the file.

## Internationalization

The site ships in Spanish and English via [next-intl](https://next-intl.dev).

- **Copy** lives in `messages/es.json` and `messages/en.json` — never hardcode user-facing text in a component.
- **Routing** is configured in `i18n/routing.ts`. Spanish is the default and keeps the bare URLs (`/`, `/brand`); English is prefixed (`/en`, `/en/brand`). First-time visitors are routed by their `accept-language` header, and the `NEXT_LOCALE` cookie remembers a manual choice.
- **Internal links** must use `Link` / `useRouter` from `@/i18n/navigation` so the locale prefix is preserved.
- **Talks and repos** keep only their stable ids in `lib/talks.ts` and `lib/github.ts`; their titles and descriptions are localized under `Talks.items.<id>` and `Repos.descriptions.<name>`.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

<a href="https://v0.app/chat/api/kiro/clone/alquimia-hq/alquimia" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
