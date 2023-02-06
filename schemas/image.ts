import {defineField, defineType} from 'sanity'
import {AICaption} from '../components/AICaption'

export default defineType({
  name: 'object.image',
  title: 'Image',
  type: 'object',
  components: {
    // @ts-ignore
    input: AICaption,
  },
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      imageUrl: 'image.asset.url',
      title: 'caption',
    },
    prepare({imageUrl, title}) {
      return {
        title,
        imageUrl,
      }
    },
  },
})
