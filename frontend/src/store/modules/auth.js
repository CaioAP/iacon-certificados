import {
  AUTH_REQUEST,
  AUTH_ERROR,
  AUTH_SUCCESS,
  AUTH_LOGOUT
} from '../actions/auth'
import { USER_REQUEST } from '../actions/user'
import axios from 'axios'
import router from '../../router/index'

const state = {
  token: localStorage.getItem('user-token') || '',
  status: '',
  username: localStorage.getItem('username') || '',
  hasLoadedOnce: false
}

const getters = {
  isAuthenticated: state => !!state.token,
  authStatus: state => state.status,
  username: state => state.username
}

const actions = {
  [AUTH_REQUEST]: ({ commit, dispatch }, user) => {
    return new Promise((resolve, reject) => {
      commit(AUTH_REQUEST)
      axios({
        url: `http://${location.hostname}:2160/users/auth`,
        data: user,
        method: 'POST'
      })
        .then(resp => {
          const token = resp.data.token
          localStorage.setItem('user-token', token)
          localStorage.setItem('username', user.username)
          axios.defaults.headers.common['Authorization'] = token
          commit(AUTH_SUCCESS, token, user.username)
          dispatch(USER_REQUEST, user.username)
          resolve(resp)
        })
        .catch(err => {
          commit(AUTH_ERROR, err)
          localStorage.removeItem('user-token')
          localStorage.removeItem('username')
          reject(err)
        })
    })
  },
  [AUTH_LOGOUT]: ({ commit }) => {
    return new Promise(resolve => {
      commit(AUTH_LOGOUT)
      localStorage.removeItem('user-token')
      localStorage.removeItem('username')
      delete axios.defaults.headers.common['Authorization']
      resolve()
      router.replace('/login')
    })
  }
}

const mutations = {
  [AUTH_REQUEST]: state => {
    state.status = 'loading'
  },
  [AUTH_SUCCESS]: (state, token, username) => {
    state.status = 'success'
    state.token = token
    state.username = username
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
