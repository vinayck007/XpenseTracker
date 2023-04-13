const getExpenses = (res) => {
  return req.user.getExpenses()
}

module.exports = {
  getExpenses
}