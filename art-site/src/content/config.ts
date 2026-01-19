import { defineCollection, z } from 'astro:content';

const personajes = defineCollection({
	schema: z.object({
		nombre: z.string(),
		arquetipo: z.string(), 
		casta: z.string(), 
		colorHex: z.string(), 
		edad: z.number().optional(),
		descripcion: z.string(), 
		avatar: z.string().optional(), 
        tipo: z.enum(['Principal', 'Secundario', 'Sin Apariciones']).default('Principal'),
	}),
});

export const collections = { personajes };