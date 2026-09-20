# cookd

A cooking coach you learn from. Tell it what's in your kitchen, send a photo, and talk it through.
It knows what's in your pantry and remembers how your past dishes went, so its suggestions get better
the more you cook.

The client for [cookd-api](https://github.com/dragunovartem99/cookd-api).

- **Chat** with streamed answers, photos (attach or paste; shrunk in the browser before upload)
- **Pantry** of what you usually buy, with an in-stock switch per item — nothing to retype when you restock
- **Journal** of dishes cooked: taste out of 5, minutes taken, a note

Svelte 5 + Vite + TypeScript, no router and no UI kit.

## Development

```console
$ npm ci
$ npm run dev      # talks to http://localhost:50001 (run cookd-api with `make run`)
```

`VITE_API_URL` overrides the API address; production builds default to `https://cookd.dragunov.dev`.

`npm run lint:check` also enforces a limit of **100 lines per file** (blank lines and comments not
counted). oxlint applies it to TypeScript and to the `<script>` block of a component;
`scripts/check-lines.ts` applies it to the whole `.svelte` file, markup and styles included.

## Deploying

Pushing to `main` builds the site and publishes it to GitHub Pages through the shared
[pipes](https://github.com/dragunovartem99/pipes) workflow. Enable Pages once under
Settings → Pages → Source: **GitHub Actions**.

The API allows only one browser origin, so the API's `ALLOWED_ORIGIN` must be this site's origin
(`https://dragunovartem99.github.io`).
