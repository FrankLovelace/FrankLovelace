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
        sale_portada: z.enum(['si', 'no']).default('no'),
        '7familias': z.enum(['si', 'no']).default('no'),
        familia: z.string().optional(),
        color: z.string(),
        ocupacion: z.string(),
        es_visible: z.enum(['si', 'no']).default('si'),
        silueta: z.string().optional(),
        proveniencia: z.string(),
        avatar: z.string().optional(), 
    }).refine((data) => {
        if (data['7familias'] === 'si' && !data.familia) {
            return false;
        }
        return true;
    }, {
        message: "El campo 'familia' es obligatorio si '7familias' es 'si'",
        path: ["familia"]
    }).refine((data) => {
        // silueta es requerida si es_visible es 'si' Y avatar está vacío/no existe
        const hasAvatar = data.avatar && data.avatar.trim() !== '';
        if (data.es_visible === 'si' && !hasAvatar && !data.silueta) {
            return false;
        }
        return true;
    }, {
        message: "El campo 'silueta' es obligatorio si 'es_visible' es 'si' y no se provee un 'avatar'",
        path: ["silueta"]
    })
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
const familias = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/familias" }),
    schema: z.object({
        id: z.number().min(1).max(7),
        nombre: z.string(),
        especialidad: z.string(), 
        colorHex: z.string(),
        descripcion: z.string(),
    })
});
const archivos = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/archivos" }),
    schema: z.object({
        codigo: z.string(), 
        titulo: z.string(),
        fecha: z.string(),
        nivel: z.enum(['CONFIDENCIAL', 'SECRETO', 'TOP SECRET', 'EYES ONLY']),
        estado: z.enum(['Abierto', 'Cerrado', 'Sin Resolver']),
        tags: z.array(z.string()).optional()
    })
});

export const collections = { 
    personajes, 
    lugares,
    familias, 
    archivos 
};