import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; 

const personajes = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/personajes" }),
	schema: z.object({
		nombre: z.string(),
        alias: z.string().optional(),
		casta: z.string(), 
		colorHex: z.string(), 
		descripcion: z.string(), 
        esTocado: z.boolean().default(false),
		avatar: z.string().optional(), 
	}),
});

const lugares = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/lugares" }),
    schema: z.object({
        nombre: z.string(),
        region: z.string(),
        imagen: z.string(),
        descripcion: z.string()
    })
});

export const collections = { personajes, lugares };