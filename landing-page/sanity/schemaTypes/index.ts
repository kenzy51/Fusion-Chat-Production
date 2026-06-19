// sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import { post } from './post' // Import the file we just made
import { author } from './author'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [post,author], // Add 'post' to this array
}