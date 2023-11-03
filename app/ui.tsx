export const Title = ({ children }: { children: React.ReactNode }) => (
  <h1 className='font-bold text-3xl text-center text-white/80'>
    {children}
  </h1>
)

export const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <p className='text-center text-white/40'>
    {children}
  </p>
)

export const Divider = () => (
  <hr className='border-white/20' />
)

export const Input = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => (
  <div className='flex flex-col space-y-1'>
    <label className='font-bold text-sm text-white/40'>
      {label}
    </label>
    <input
      className='bg-[#222d32] text-white rounded p-2 focus:outline-none'
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)

export const TextArea = ({ label, value, onChange }: { label: string, value: string, onChange: (value: string) => void }) => (
  <div className='flex flex-col space-y-1'>
    <label className='font-bold text-sm text-white/40'>
      {label}
    </label>
    <textarea
      className='bg-[#222d32] text-white rounded p-2 focus:outline-none'
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
)