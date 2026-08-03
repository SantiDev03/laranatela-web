import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/productos' }),
  schema: z.object({
    nombre: z.string(),
    categoria: z.enum(['ecobolsas', 'mochilas-bolsos', 'combos', 'merchandising']),
    resumen: z.string(),
    medidas: z.string().optional(),
    material: z.string().optional(),
    impresion: z.array(z.string()).default([]),
    minimo: z.number().optional(),
    destacado: z.boolean().default(false),
    orden: z.number().default(99),
  }),
});

export const collections = { productos };