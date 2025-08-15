import { useState } from 'react'
import Router from 'next/router'
import Form from '../../src/components/form'
import { useModalContext } from '../../src/context/ModalContext'
import { Loading } from '../../src/components/Reusables/Loading'
import { getLoginSession } from '../../src/lib/auth'
import { findUser } from '../../src/lib/user'
import { mutate } from 'swr'

const Login = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const { loading, setLoading } = useModalContext()

  async function handleSubmit (e) {
    e.preventDefault()
    setLoading(true)
    if (errorMsg) setErrorMsg('')

    console.log(123, e.currentTarget.rememberMe.checked)

    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
      rememberMe: e.currentTarget.rememberMe.checked
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (res.status === 200) {
        await mutate('/api/user')
        setLoading(false)
        Router.push('/auth/verify')
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
      setLoading(false)
      setErrorMsg(error.message)
    }
  }

  return (
    <>
      {loading && <Loading />}
      <Form isLogin errorMessage={errorMsg} onSubmit={handleSubmit} />
    </>
  )
}

export const getServerSideProps = async ({ req, res }) => {
  const session = await getLoginSession(req)
  const user = (session?._doc && (await findUser(session._doc))) ?? null
  if (user) {
    return {
      redirect: {
        destination: `/dashboard/${user?.category}`,
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}

export default Login
