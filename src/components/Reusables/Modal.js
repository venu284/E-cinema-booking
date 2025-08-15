import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useModalContext } from '../../context/ModalContext'
import { DeleteForm } from '../ModalForms/DeleteForm'
import { DeletePromotionForm } from '../ModalForms/DeletePromotionForm'
import { DeleteUserForm } from '../ModalForms/DeleteUserForm'
import { CardAddForm } from '../ModalForms/CardAddForm'
import { CardEditForm } from '../ModalForms/CardEditForm'
import { CardDeleteForm } from '../ModalForms/CardDeleteForm'
import { ShowroomAddForm } from '../ModalForms/ShowroomAddForm'
import { ShowroomEditForm } from '../ModalForms/ShowroomEditForm'
import { ShowroomDeleteForm } from '../ModalForms/ShowroomDeleteForm'
import { DeleteBookingForm } from '../ModalForms/DeleteBookingForm'

export const Modal = () => {
  const { isOpen, closeModal, form, setLoading } = useModalContext()
  return (
    <Fragment>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className={`${
            isOpen
              ? 'fixed w-full h-screen top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] cursor-pointer inset-0 z-40 overflow-y-auto'
              : 'fixed inset-0 z-10 overflow-y-auto'
          } `}
          onClose={() => {
            setLoading(false)
            closeModal()
          }}
        >
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0' />
            </Transition.Child>

            <span
              className='inline-block bg-white h-screen z-10 align-middle'
              aria-hidden='true'
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div
                className={`${
                  form === 'pickTemplate' ? 'max-w-6xl' : 'w-full max-w-2xl'
                } relative inline-block p-6 my-8 overflow-hidden text-left align-middle transition-all transform ${
                  form === 'CardAddForm' || form === 'CardEditForm'
                    ? 'bg-white max-w-4xl'
                    : 'bg-gray-800'
                } shadow-xl rounded-md`}
              >
                <button
                  type='button'
                  className='absolute right-5 inline-flex justify-center p-2 text-sm font-medium text-orange-900 bg-orange-100 border border-transparent rounded-md hover:bg-orange-200 focus:outline-none'
                  onClick={() => {
                    setLoading(false)
                    closeModal()
                  }}
                >
                  <XMarkIcon className='block h-4 w-4' aria-hidden='true' />
                </button>
                {form === 'DeleteFormModal' && <DeleteForm />}
                {form === 'DeletePromotionFormModal' && <DeletePromotionForm />}
                {form === 'DeleteUserFormModal' && <DeleteUserForm />}
                {form === 'CardAddForm' && <CardAddForm />}
                {form === 'CardEditForm' && <CardEditForm />}
                {form === 'CardDeleteForm' && <CardDeleteForm />}
                {form === 'ShowroomAddForm' && <ShowroomAddForm />}
                {form === 'ShowroomEditForm' && <ShowroomEditForm />}
                {form === 'ShowroomDeleteForm' && <ShowroomDeleteForm />}
                {form === 'deleteBookingForm' && <DeleteBookingForm />}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </Fragment>
  )
}
