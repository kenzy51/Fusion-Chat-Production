import { defineField, defineType } from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      title: 'Full Name',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      type: 'string',
      title: 'Professional Title',
      description: 'e.g., Systems Architect & Founder',
    }),
    defineField({
      name: 'image',
      type: 'image',
      title: 'Author Portrait',
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
      name: 'bio',
      type: 'text',
      title: 'Biography Summary',
      description: 'Short profile description that renders at the bottom of blog articles.',
    }),
  ],
})