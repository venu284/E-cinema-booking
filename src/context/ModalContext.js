import { createContext, useContext, useState } from 'react'

const ModalContext = createContext()

export function ModalContextProvider ({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState('')
  const [form, setForm] = useState('')
  const [loading, setLoading] = useState(false)
  const [movieSearch, setMovieSearch] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [data, setData] = useState(null)

  function closeModal () {
    setIsOpen(false)
  }
  function openModal () {
    setIsOpen(true)
  }
  const state = {
    isOpen,
    setIsOpen,
    form,
    setForm,
    closeModal,
    openModal,
    isEdit,
    setIsEdit,
    loading,
    setLoading,
    movieSearch,
    setMovieSearch,
    deleteId,
    setDeleteId,
    data,
    setData,
    editId,
    setEditId
  }
  return <ModalContext.Provider value={state}>{children}</ModalContext.Provider>
}
export function useModalContext () {
  return useContext(ModalContext)
}
