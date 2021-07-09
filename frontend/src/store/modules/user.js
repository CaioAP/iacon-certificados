import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user'
import Vue from 'vue'
import axios from 'axios'
import { AUTH_LOGOUT } from '../actions/auth'

const serverURL = `${location.protocol}//${location.hostname}:1011`

const state = { status: '', userdata: {} }

const getters = {
  getUserData: state => state.userdata,
  isUserDataLoaded: state => !!state.userdata.name
}

const actions = {
  [USER_REQUEST]: async ({ commit, dispatch }, userId) => {
    try {
      commit(USER_REQUEST)
      const { data } = await axios.get(`${serverURL}/users/${userId}`)
      commit(USER_SUCCESS, data)
    } catch (error) {
      commit(USER_ERROR)
      dispatch(AUTH_LOGOUT)
    }
  }
}

const mutations = {
  [USER_REQUEST]: state => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, userData) => {
    state.status = 'success'
    Vue.set(state, 'userdata', userData)
  },
  [USER_ERROR]: state => {
    state.status = 'error'
  },
  [AUTH_LOGOUT]: state => {
    state.userdata = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
