import api from './api.js'

export const transactionService = {
  async getMyTransactions(limit = 10) {
    const res = await api.get(`/transactions?limit=${limit}`)
    return res.data
  },

  async createTransaction(payload) {
    const res = await api.post('/transactions', payload)
    return res.data
  },
}

export default transactionService