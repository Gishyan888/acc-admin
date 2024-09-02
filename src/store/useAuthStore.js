import create from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/api.js'
import axios from 'axios'

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      loginError: null,
      isAdmin: true,
      login: async (userData) => {
        try {
          // await axios('/sanctum/csrf-cookie')
          const response = await api.post('/login', userData)
          if (response.status === 200 || response.status === 201) {
            set({
              isLoggedIn: true,
              user: {
                ...response.data.data,
                token: response.data.access_token 
              },
              loginError: null,
            })
            return true
          }
        } catch (error) {
          console.error('Authentication failed:', error)
          set({
            loginError: error.response?.data?.message || 'Login failed. Please try again.',
          })
          return false
        }
      },
      logout: async () => {
          set({
            isLoggedIn: false,
            user: null,
            loginError: null,
          })
          localStorage.removeItem('auth-storage')
      },
      initializeAuth: () => {
        const storedAuth = JSON.parse(localStorage.getItem('auth-storage'))
        if (storedAuth) {
          set({
            isLoggedIn: storedAuth.state.isLoggedIn,
            user: storedAuth.state.user,
          })
        }
      },
      clearLoginError: () => set({ loginError: null }),
      checkTokenValidity: () => {
        const storedAuth = JSON.parse(localStorage.getItem('auth-storage'))
        const currentUser = get().user
        if (storedAuth && currentUser && storedAuth.state.user.token !== currentUser.token) {
          get().logout()
          return false
        }
        return true
      },
    }),
    {
      name: 'auth-storage', 
      getStorage: () => localStorage, 
    }
  )
)

export default useAuthStore