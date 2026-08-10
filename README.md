# La Rañatela — Sitio web

Sitio institucional y catálogo de productos de **La Rañatela**, organización de inclusión socio-laboral con base en Maipú, Mendoza. El sitio reemplaza al anterior desarrollo en WordPress (laranatela.com.ar).

🔗 [laranatela.com](https://laranatela.com)

## Stack

- **[Astro 7](https://astro.build)** + TypeScript — sitio 100% estático, sin adapter
- **Tailwind CSS** para estilos
- **Content Collections** de Astro para el catálogo de productos (`src/content/productos/`)
- **Cloudflare Worker** independiente (`worker-consulta/`) para el envío del formulario de contacto vía [Resend](https://resend.com), ya que el hosting (DonWeb, plan compartido) no soporta Node.js
- **Google Analytics 4** para métricas
- Hosting: **DonWeb / Ferozo** (subida manual por FTP a `public_html`)

## Estructura del proyecto

```text
/
├── public/              # Assets estáticos servidos tal cual (favicon, .htaccess, etc.)
├── src/
│   ├── assets/          # Imágenes procesadas por Astro (productos, clientes, hero)
│   ├── components/      # Componentes .astro reutilizables
│   ├── content/
│   │   └── productos/   # Catálogo — un .md por producto, ver schema en content.config.ts
│   ├── layouts/          
│   ├── pages/            # Rutas del sitio (file-based routing)
│   └── content.config.ts # Schema de validación del catálogo (Zod)
├── worker-consulta/     # Cloudflare Worker aparte, maneja el POST del formulario de contacto
└── astro.config.mjs
```

## Catálogo de productos

Cada producto es un archivo `.md` en `src/content/productos/` con frontmatter validado contra el schema en `content.config.ts`. Categorías disponibles: `bolsas`, `mochilas-bolsos`, `neceseres`, `linea-vinos`, `termicos`, `indumentaria`, `combos`, `merchandising`.

Las imágenes se referencian con rutas relativas a `src/assets/productos/` (helper `image()` de Astro), no desde `public/`.

## Comandos

Todos los comandos se corren desde la raíz del proyecto:

| Comando           | Acción                                              |
| :----------------- | :--------------------------------------------------- |
| `npm install`       | Instala dependencias                                 |
| `npm run dev`       | Levanta el servidor de desarrollo en `localhost:4321` |
| `npm run build`     | Genera el sitio estático en `./dist/`                |
| `npm run preview`   | Sirve el build de producción localmente para probarlo |

## Formulario de contacto (Cloudflare Worker)

El `<form>` de `/contacto` postea directo a `https://laranatela-consulta.laranatela.workers.dev`, sin pasar por Astro. El Worker vive en `worker-consulta/` con su propio `package.json` y `wrangler.jsonc`.

Para trabajar sobre el Worker:

```sh
cd worker-consulta
npm install
npx wrangler dev       # entorno local
npx wrangler deploy    # publica cambios
```

El `RESEND_API_KEY` se configura como secret de Wrangler (`npx wrangler secret put RESEND_API_KEY`), nunca como variable en texto plano en el repo.

## Despliegue

El sitio es estático, así que el deploy consiste en:

1. `npm run build`
2. Subir el contenido de `dist/` (no la carpeta en sí, su contenido) a `public_html/` en el hosting de DonWeb vía FTP (FileZilla)

El dominio `laranatela.com` y `laranatela.com.ar` apuntan al mismo hosting/`public_html`. Los redirects desde URLs del WordPress viejo están en `public/.htaccess`.

## Notas

- No hay venta online ni pasarela de pago: el sitio es catálogo + cotizador. Todos los productos son a medida, sin talles ni precios fijos publicados.
- El texto **"disCAPACIDAD"** (con esa capitalización) se usa en el copy visible del sitio, pero no en meta descriptions ni JSON-LD.
- Servicio de bordado: tercerizado pero coordinado y garantizado por La Rañatela (no se presenta como 100% in-house).
