import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'document.gallery',
  title: 'Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'object.image',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      imageUrl: 'images.0.image.asset.url',
    },
    prepare({title, imageUrl}) {
      return {
        title,
        imageUrl,
      }
    },
  },
})
