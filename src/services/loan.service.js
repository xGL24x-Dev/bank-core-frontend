import api from './api.js'

export const loanService = {
  async getMyLoans() {
    const res = await api.get('/loans')
    return res.data
  },

  async createLoan(payload) {
    const res = await api.post('/loans', payload)
    return res.data
  },
}

export default loanService