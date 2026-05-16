import api from './api.js'

export const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats')
    return res.data
  },

  async getAllAccounts() {
    const res = await api.get('/accounts/all')
    return res.data
  },

  async getAllTransactions() {
    const res = await api.get('/admin/transactions')
    return res.data
  },

  async getAllLoans() {
    const res = await api.get('/loans/all')
    return res.data
  },

  async updateLoanStatus(id, estado) {
    const res = await api.patch(`/loans/${id}/status`, { estado })
    return res.data
  },

  async addSaldo(payload) {
    const res = await api.post('/accounts/add-saldo', payload)
    return res.data
  },
}

export default adminService
