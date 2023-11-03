'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { ImSpinner } from 'react-icons/im'

import { Divider, Input, Paragraph, TextArea, Title } from './ui'

export default function HomePage()
{
  const [config, setConfig] = useState<WAConfig>({
    phoneNumberId: '',
    accessToken: '',
    templateId: '',
    languageCode: 'en',
    headerImageLink: ''
  })

  const [recipientsInput, setRecipientsInput] = useState<string>('')

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [deliveryStatus, setDeliveryStatus] = useState<WADeliveryStatus[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
  {
    e.preventDefault()

    // make sure the phone number is contains numbers only
    if (!config.phoneNumberId.match(/^\d+$/))
    {
      toast.error('Invalid phone number ID.')
      return
    }

    // make sure the access token is not empty
    if (!config.accessToken)
    {
      toast.error('Invalid access token.')
      return
    }

    // make sure the template ID is not empty
    if (!config.templateId)
    {
      toast.error('Invalid template ID.')
      return
    }

    // make sure the language code is not empty
    if (!config.languageCode)
    {
      toast.error('Invalid language code.')
      return
    }

    // make sure the recipients list is not empty, without duplicates, and contains numbers only
    const recipients = recipientsInput.split('\n').map(phoneNumber => phoneNumber.trim())
    if (!recipients.length)
    {
      toast.error('Invalid recipients list.')
      return
    }
    if (recipients.some(phoneNumber => !phoneNumber.match(/^\d+$/)))
    {
      toast.error('Invalid recipients list. Please make sure each line contains numbers only, without the plus sign, and without any spaces, dashes and parenthesis.')
      return
    }
    if (recipients.some((phoneNumber, index) => recipients.indexOf(phoneNumber) !== index))
    {
      toast.error('Invalid recipients list. Please make sure there are no duplicates.')
      return
    }

    setIsSubmitting(true)
    for (const recipient of recipients)
    {
      await sendMessage(recipient)
        .then(res =>
        {
          if (res.error)
          {
            throw new Error(res.error.message)
          }

          setDeliveryStatus(prev => [...prev, {
            phoneNumber: recipient,
            message: 'Sent'
          }])
          toast.success(`Successfully sent message to ${recipient}.`)
        })
        .catch(err =>
        {
          setDeliveryStatus(prev => [...prev, {
            phoneNumber: recipient,
            message: err.message
          }])
          toast.error(`Failed to send message to ${recipient} because ${err.message}`)
        })
    }
    setIsSubmitting(false)

  }

  const sendMessage = async (phoneNumber: string) =>
  {
    const res = await fetch(`https://graph.facebook.com/v18.0/${config.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: config.templateId,
          language: {
            code: config.languageCode
          },
          components: [{
            type: 'header',
            parameters: [{
              type: 'image',
              image: {
                link: config.headerImageLink
              }
            }]
          }]
        }
      })
    })
    return await res.json()
  }

  return (
    <div className='max-w-screen-sm mx-auto px-4 py-8 space-y-8'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col space-y-4'
      >

        {/* Header */}
        <Title>Message Sender</Title>
        <Paragraph>A tool to send messages to people using the WhatsApp Business Cloud API.</Paragraph>
        <Divider />

        {/* Config */}
        <Title>Configuration</Title>
        <Input
          label='Phone Number ID'
          value={config.phoneNumberId}
          onChange={value => setConfig({ ...config, phoneNumberId: value })}
        />
        <TextArea
          label='Access Token'
          value={config.accessToken}
          onChange={value => setConfig({ ...config, accessToken: value })}
        />
        <Divider />

        {/* Template */}
        <Title>Template Data</Title>
        <Input
          label='Template Id'
          value={config.templateId}
          onChange={value => setConfig({ ...config, templateId: value })}
        />
        <Input
          label='Language Code'
          value={config.languageCode}
          onChange={value => setConfig({ ...config, languageCode: value })}
        />
        <Input
          label='Header Image Link'
          value={config.headerImageLink}
          onChange={value => setConfig({ ...config, headerImageLink: value })}
        />
        <Divider />

        {/* Recipients */}
        <Title>Recipients</Title>
        <Paragraph>Enter a list of phone numbers, one per line.</Paragraph>
        <TextArea
          label='Recipients'
          value={recipientsInput}
          onChange={value => setRecipientsInput(value)}
        />
        <Divider />

        {/* Submit */}
        <button
          type='submit'
          className='bg-[#1eb980] text-white font-bold py-2 rounded'
          disabled={isSubmitting}
        >
          {
            isSubmitting
              ? <ImSpinner className='animate-spin text-2xl mx-auto' />
              : 'Send Messages'
          }
        </button>
        <Divider />

      </form>

      {/* Delivery Status */}
      {
        deliveryStatus?.[0]
        && <div className='flex flex-col space-y-4'>
          <Title>Delivery Status</Title>
          <table className='bg-[#222d32] p-4 rounded w-full'>
            <thead>
              <tr>
                <th className='font-bold text-white/80 p-2'>Phone Number</th>
                <th className='font-bold text-white/80 p-2'>Message</th>
              </tr>
            </thead>
            <tbody>
              {
                deliveryStatus.map(({ phoneNumber, message }) => (
                  <tr key={phoneNumber} className='border-t border-white/20'>
                    <td className='text-white/40 p-2'>{phoneNumber}</td>
                    <td className='text-white/40 p-2'>{message}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      }

    </div>
  )
}