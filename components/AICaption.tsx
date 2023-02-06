import {useCallback, useState} from 'react'
import {ComponentIcon} from '@sanity/icons'
import {FieldMember, InputProps, MemberField, ObjectInputProps} from 'sanity'
import {Box, Button, Card, Flex, Grid, Stack} from '@sanity/ui'

const createImageUrl = ({imageName, fileExtension}: {imageName: string; fileExtension: string}) => {
  return `https://cdn.sanity.io/images/gm704fzt/production/${imageName}.${fileExtension}`
}

const generate = async (imageUrl: string): Promise<string | undefined> => {
  try {
    // POST request to Replicate to start the image restoration generation process
    let startResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + '99dbec1a7d51e9d99196ac28a476b77b8778a614',
      },
      body: JSON.stringify({
        version: '2e1dddc8621f72155f24cf2e0adbde548458d3cab9f00c0139eea840d0ac4746',
        input: {image: imageUrl},
      }),
    })

    let jsonStartResponse = await startResponse.json()
    let endpointUrl = jsonStartResponse.urls.get

    // GET request to get the status of the image restoration process & return the result when it's ready
    let restoredImage: string | null = null
    while (!restoredImage) {
      // Loop in 1s intervals until the alt text is ready
      console.log('polling for result...')
      let finalResponse = await fetch(endpointUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + process.env.REPLICATE_API_KEY,
        },
      })
      let jsonFinalResponse = await finalResponse.json()

      if (jsonFinalResponse.status === 'succeeded') {
        restoredImage = jsonFinalResponse.output
      } else if (jsonFinalResponse.status === 'failed') {
        break
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    if (restoredImage) {
      return restoredImage
    }
    return undefined
  } catch (error) {
    console.log(error)
  }
}

export const AICaption = (props: ObjectInputProps) => {
  const [loading, setLoading] = useState(false)
  const {value, members, renderField, renderInput, renderItem, renderPreview} = props

  const aiCaptionImageMember = members.find(
    (member): member is FieldMember => member.kind === 'field' && member.name === 'image'
  )

  const aiCaptionCaptionMember = members.find(
    (member): member is FieldMember => member.kind === 'field' && member.name === 'caption'
  )

  const generateCaption = useCallback(async () => {
    const imageUrl = value?.image?.asset?._ref
    const imageParts = imageUrl?.split('-')
    // Remove "image-"
    imageParts.shift()
    // Get the file extension
    const fileExtension = imageParts?.pop()
    // Get the image name
    const imageName = imageParts.join('-')
    // Create the image url
    const url = createImageUrl({imageName, fileExtension})
    setLoading(true)
    const aiCaption = await generate(url)
    console.log('aiCaption', aiCaption)
    // setLoading(true)
    // setTimeout(() => {
    //   setLoading(false)
    // }, 3000)
  }, [value])

  const customRenderInput = useCallback(
    (renderInputCallbackProps: InputProps) => {
      return (
        <Grid>
          <Stack>
            <Flex>
              <Box flex={1}>
                <Card disabled={loading}>{renderInput(renderInputCallbackProps)}</Card>
              </Box>
              <Box marginLeft={1}>
                <Button
                  mode="ghost"
                  icon={ComponentIcon}
                  onClick={generateCaption}
                  text={loading ? 'Generating...' : 'Generate'}
                />
              </Box>
            </Flex>
          </Stack>
        </Grid>
      )
    },
    [generateCaption, loading, renderInput]
  )

  return (
    <Stack space={4}>
      {aiCaptionImageMember && (
        <MemberField
          member={aiCaptionImageMember}
          renderInput={renderInput}
          renderField={renderField}
          renderItem={renderItem}
          renderPreview={renderPreview}
        />
      )}
      {aiCaptionCaptionMember && (
        <MemberField
          member={aiCaptionCaptionMember}
          renderInput={customRenderInput}
          renderField={renderField}
          renderItem={renderItem}
          renderPreview={renderPreview}
        />
      )}
    </Stack>
  )
}
