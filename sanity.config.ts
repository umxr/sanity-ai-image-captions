import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'AI Image Captions',

  projectId: 'gm704fzt',
  dataset: 'production',

  plugins: [deskTool(), visionTool(), unsplashImageAsset()],

  schema: {
    types: schemaTypes,
  },
})
