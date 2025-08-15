import React, { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'

export const Variations = ({
  title,
  extraOptions,
  handleExtraOptions,
  deleteOption
}) => {
  const [extra, setExtra] = useState({ name: '', value: '' })
  const handleExtraInput = e => {
    setExtra({ ...extra, [e.target.name]: e.target.value })
  }
  return (
    <div>
      <label
        htmlFor='extra'
        className='block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2'
      >
        {title}
      </label>
      <div>
        <div className='mt-1 flex items-center justify-between'>
          <input
            className='max-w-lg mr-2 block w-full shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md'
            type='text'
            placeholder='Item'
            value={extra.name}
            name='name'
            onChange={handleExtraInput}
          />
          <input
            className='max-w-lg block w-full shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md mr-2'
            type='text'
            placeholder='Value'
            name='value'
            value={extra.value}
            onChange={handleExtraInput}
          />
          <div
            className='py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-orange-500 bg-orange-700 cursor-pointer text-white'
            onClick={e => {
              setExtra({
                name: '',
                value: ''
              })
              handleExtraOptions(extra)
            }}
          >
            Add
          </div>
        </div>
        <div className='flex flex-col w-full'>
          {extraOptions?.map(option => (
            <div
              key={option.text}
              className='flex justify-between items-center border-2 my-1 px-4 py-2 rounded-md'
            >
              <div className='flex items-center'>
                <p className='uppercase text-xs font-semibold tracking-wide'>
                  {option.name}
                </p>
                <span className='mx-5'>-</span>
                <p className='text-sm font-semibold'>
                  <span className='text-sm font-semibold tracking-wide uppercase'>
                    {option.value}
                  </span>
                </p>
              </div>
              <div
                onClick={() => {
                  setExtra({
                    name: '',
                    value: ''
                  })
                  deleteOption(option)
                }}
                className='text-red-600 hover:text-red-400 text-lg cursor-pointer'
              >
                <XMarkIcon className='h-6 w-6' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
