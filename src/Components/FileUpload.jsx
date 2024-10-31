import { useRef } from 'react'
import { ArrowUpTrayIcon } from '@heroicons/react/16/solid'

export default function FileUpload({
  file,
  onFileSelect,
  onFileRemove,
  accept = 'image/*',
  buttonText = 'Upload File',
  imageSize,
  error,
  label,
  tooltip="Remove"
}) {
  const hiddenFileInput = useRef(null)

  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    onFileSelect(selectedFile)
  }

  return (
    <div>
      {file ? (
        <div className={`relative mx-2 ${imageSize ? imageSize : 'w-20 h-20'}`}>
          <img
            src={file instanceof File ? URL.createObjectURL(file) : file}
            className={`w-full h-full object-cover ${
              imageSize ? 'rounded-lg' : 'rounded-full'
            }`}
            alt='Uploaded file'
          />
          <button title={tooltip}
            className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2 transition-opacity duration-200'
            onClick={() => onFileRemove()}
            type='button'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-4 w-4'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>
      ) : (
        <div>
          <span className='text-gray-500 text-sm'>{label}</span>
          <button
            onClick={handleClick}
            type='button'
            className='mt-1 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300'
          >
            <ArrowUpTrayIcon className='w-5 h-5' />
            <span>{buttonText}</span>
            <input
              type='file'
              onChange={handleFileChange}
              ref={hiddenFileInput}
              style={{ display: 'none' }}
              accept={accept}
            />
          </button>
        </div>
      )}
      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
    </div>
  )
}
