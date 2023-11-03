import { Toaster } from 'react-hot-toast'

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Message Sender',
  description: 'A tool to send messages to people using the WhatsApp Business Cloud API.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) 
{
  return (
    <html lang='en'>
      <body className='bg-[#0d151a]' style={{
        backgroundImage: 'url(/images/bg.png)',
        backgroundRepeat: 'repeat'
      }}>
        <main className='bg-[#0d151a]/95'>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}