import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT
} from '../actions/auth'
import { USER_REQUEST } from '../actions/user'
import axios from 'axios'
import router from '../../router/index'

const serverURL = `${location.protocol}//${location.hostname}:1011`

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  userId: localStorage.getItem('userId') || '',
  hasLoadedOnce: false
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  userId: state => state.userId
}

const actions = {
  [AUTH_REQUEST]: async ({ commit, dispatch }, user) => {
    try {
      commit(AUTH_REQUEST)
      const { data } = await axios.post(`${serverURL}/users/auth`, user)

      localStorage.setItem('user-token', data.token)
      localStorage.setItem('userId', data.id)
      axios.defaults.headers.common['Authorization'] = data.token

      commit(AUTH_SUCCESS, data.token, data.id)
      dispatch(USER_REQUEST, data.id)
    } catch (error) {
      commit(AUTH_ERROR, error)
      localStorage.removeItem('user-token')
      localStorage.removeItem('userId')
    }
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    commit(AUTH_LOGOUT)

    localStorage.removeItem('user-token')
    localStorage.removeItem('userId')
    delete axios.defaults.headers.common['Authorization']

    router.replace('/login')
  }
}

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, token, userId) => {
    state.status = 'success'
    state.token = token
    state.userId = userId
    state.hasLoadedOnce = true
  },
  [AUTH_ERROR]: state => {
    state.status = 'error'
    state.hasLoadedOnce = true
  },
  [AUTH_LOGOUT]: state => {
    state.token = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
