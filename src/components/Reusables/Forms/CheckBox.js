import React from 'react'
export const CheckBox = ({ options, setCheckedOptions, checkedOptions }) => {
  return (
    <>
      <fieldset className='px-5 py-3'>
        <div className='grid grid-cols-5 relative items-start'>
          {options?.map(category => {
            return (
              <div key={category.title} className='mb-2 flex mr-4'>
                <div className='flex items-center h-5 w-6'>
                  <input
                    id={category._id}
                    name={category.title}
                    type='checkbox'
                    checked={checkedOptions?.includes(category._id)}
                    onChange={e => {
                      const id = checkedOptions?.indexOf(category._id)
                      if (id == -1)
                        setCheckedOptions([...checkedOptions, category._id])
                      else {
                        const cat = checkedOptions
                        cat.splice(id, 1)
                        setCheckedOptions([...cat])
                      }
                    }}
                    className='h-4 w-4 text-orange-600 border-gray-300 rounded'
                  />
                </div>
                <div className='ml-1 text-sm'>
                  <label
                    htmlFor={category.title}
                    className='font-medium text-gray-900'
                  >
                    {category.title}
                  </label>
                </div>
              </div>
            )
          })}
        </div>
      </fieldset>
    </>
  )
}
