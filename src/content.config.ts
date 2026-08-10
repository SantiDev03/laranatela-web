import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/productos' }),
  schema: ({ image }) =>
    z.object({
      nombre: z.string(),
      categoria: z.enum([
        'bolsas',
        'mochilas-bolsos',
        'neceseres',
        'linea-vinos',
        'termicos',
        'indumentaria',
        'combos',
        'merchandising',
      ]),
      material: z.enum([
     'lienzo',
     'friselina',
     'gabardina',
     'brin',
     'jean',
     'neoprene',
     'poliester',
     'polar',
     'ceramica',
     'algodon',   
     'mixto',
   ]),
      fuelle: z.enum(['sin-fuelle', 'base', 'contorno']).optional(),
      resumen: z.string(),
      medidaReferencia: z.string().optional(),
      colores: z.array(z.string()).default([]),
      impresion: z.array(z.string()).default([]),
      reciclado: z.boolean().default(false),
      destacado: z.boolean().default(false),
      orden: z.number().default(99),
      // Sin alternativa de material (ej: mochila urbana, delantales, chalecos).
      // Si es true, la ficha no muestra ninguna opción extra de tela.
      materialFijo: z.boolean().default(false),
      // Telas alternativas puntuales para ESTE producto (ej: ['FOIL'] para el
      // tote grande). Si queda vacío y materialFijo es false, la ficha muestra
      // el texto general (friselina, gabardina o lienzo, consultar otra tela).
      materialesAlternativos: z.array(z.string()).default([]),
      imagen: image().optional(),
      imagenAlt: z.string().optional(),
      galeria: z.array(z.object({ src: image(), alt: z.string() })).default([]),
    }),
});

export const collections = { productos };