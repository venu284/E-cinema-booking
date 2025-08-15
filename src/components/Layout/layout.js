import { Navbar } from './navbar'

export const Layout = ({ children }) => {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <Navbar />
      <main>{children}</main>
    </div>
  )
}
