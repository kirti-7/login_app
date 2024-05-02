import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Recovery, Register, Reset, Username, Password, PageNotFound, Profile} from './components'

// protect routes middleware
import { AuthorizeUser, ProtectRoute, RedirectToProfile } from './middleware/protectRoutes'

// root routes 
const router = createBrowserRouter([
    {
        path: '/',
        element: <RedirectToProfile> <Username /> </RedirectToProfile>
    },
    {
        path: '/register',
        element: <Register></Register>
    },
    {
        path: '/password',
        element: <ProtectRoute> <Password /> </ProtectRoute>
    },
    {
        path: '/profile',
        element: <AuthorizeUser> <Profile /> </AuthorizeUser>
    },
    {
        path: '/reset',
        element: <Reset></Reset>
    },
    {
        path: '/recovery',
        element: <Recovery></Recovery>
    },
    {
        path: '*',
        element: <PageNotFound></PageNotFound>
    },
    
])

const App = () => {
  return (
      <main>
          <RouterProvider router={router}></RouterProvider>
      </main>
  )
}

export default App