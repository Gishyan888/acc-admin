import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'react-tooltip'

export default function Header() {
  const navigate = useNavigate()
  return (
    <div className="text-3xl font-bold w-full h-24 flex items-center justify-between p-4 border-b-2">
      <p>Hello 👋</p>
      <div className="rounded-full h-10 w-10 bg-gray-700 cursor-pointer"
        data-tooltip-id='my-tooltip'
        data-tooltip-content='My Account'
        onClick={() => navigate('/my-account/account-details')}>
      </div>
      <Tooltip
        id='my-tooltip'
        style={{
          backgroundColor: '#fff',
          color: '#222',
          boxShadow: '0 0 5px #ddd',
          fontSize: '1rem',
          fontWeight: 'normal',
        }}
      />
    </div>
  )
}