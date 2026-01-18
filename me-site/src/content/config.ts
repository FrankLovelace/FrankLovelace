import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: ({ image }) => z.object({ 
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		heroImage: image().optional(), 
        category: z.string().default('Editorial'),
	}),
});

export const collections = { blog };