import { USER_REQUEST, USER_ERROR, USER_SUCCESS } from '../actions/user'
import Vue from 'vue'
import axios from 'axios'
import { AUTH_LOGOUT } from '../actions/auth'

const state = { status: '', userdata: {} }

const getters = {
  getUserdata: state => state.userdata,
  isUserdataLoaded: state => !!state.userdata.name
}

const actions = {
  [USER_REQUEST]: ({ commit, dispatch }) => {
    commit(USER_REQUEST)
    axios({ url: `http://${location.hostname}:2160/users` })
      .then(resp => {
        console.log('resp.data :>> ', resp)
        commit(USER_SUCCESS, resp)
      })
      .catch(error => {
        console.log('error :>> ', error.response)
        commit(USER_ERROR)
        dispatch(AUTH_LOGOUT)
      })
  }
}

const mutations = {
  [USER_REQUEST]: state => {
    state.status = 'loading'
  },
  [USER_SUCCESS]: (state, resp) => {
    state.status = 'success'
    Vue.set(state, 'userdata', resp.data)
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
