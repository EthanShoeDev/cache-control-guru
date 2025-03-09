# 🌐 Cache-Control Guru

![Cache-Control Guru](public/header.svg)

A web application that helps you understand and generate HTTP Cache-Control headers with ease.

## 🚀 Features

- **Explain Mode**: Paste in any Cache-Control header and get a detailed explanation of each directive
- **Generate Mode**: Build the perfect Cache-Control header using a user-friendly interface
- **Shareable URLs**: Share your headers via URL parameters
- **Dark/Light Mode**: Choose your preferred theme

## 🧰 Tech Stack

- **[SolidJS](https://www.solidjs.com/)**: Fast, reactive UI library
- **[TanStack Router](https://tanstack.com/router/latest)**: Type-safe routing with URL state
- **[shadcn-solid](https://shadcn-solid.com/)**: High-quality UI components
- **[Kobalte](https://kobalte.dev/)**: Accessible UI primitives
- **[Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)**: Utility-first CSS framework

## 🏃‍♂️ Running Locally

```bash
# Install dependencies
pnpm install

# Start the development server
pnpm run dev

# Build for production
pnpm run build

# Start the production server
pnpm run start
```

## 📝 Understanding Cache-Control

The Cache-Control HTTP header controls how browsers and CDNs cache content:

```
Cache-Control: public, max-age=3600, immutable
```

The above header tells browsers and CDNs that:

- This content can be cached by any cache (`public`)
- The cache can be used for 1 hour before checking for updates (`max-age=3600`)
- The content will never change, so browsers can skip revalidation on reload (`immutable`)

## 💡 Inspiration

This project was inspired by user-friendly tools that simplify complex technical topics:

- [crontab.guru](https://crontab.guru/) - The cron schedule expression editor
- [kurtextrem.de/cache](https://kurtextrem.de/cache) - Cache-Control header builder

## 📖 Resources

- [MDN: Cache-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)
- [web.dev: HTTP caching](https://web.dev/articles/http-cache)
- [Cloudflare: Cache-Control](https://developers.cloudflare.com/cache/concepts/cache-control/)

## 📄 License

MIT
