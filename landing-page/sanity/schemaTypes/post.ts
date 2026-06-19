import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'URL Slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'description',
      type: 'text',
      title: 'SEO Description',
      description: 'A short summary (150-160 characters) for search engines.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      title: 'Main Image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ]
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published at',
    }),
    
    defineField({
      name: 'author',
      title: 'Author Reference',
      type: 'reference',
      to: [{ type: 'author' }], // Explicit connection to our author document type
      validation: (Rule) => Rule.required(), // Prevents orphan, anonymous posts
    }),

    defineField({
      name: 'body',
      type: 'array',
      title: 'Body',
      of: [{ type: 'block' }],
    }),
  ],
})