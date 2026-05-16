import api from './api.js'

export const accountService = {
  async getMyAccounts() {
    const res = await api.get('/accounts')
    return res.data
  },

  async createAccount(payload) {
    const res = await api.post('/accounts', payload)
    return res.data
  },
}

export default accountService