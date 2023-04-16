const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('sequelize')

exports.leaderboard = async (req, res) => {

  try {

    // const calculateTotalExpense = async () => {
    //   try {
    //     const users = await User.findAll({
    //       include: [
    //         {
    //           model: Expense,
    //           attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
    //         },
    //       ],
    //       group: ['User.id'],
    //     });
    
    //     users.forEach(async (user) => {
    //       await User.update(
    //         { totalexpense: user.Expenses[0].dataValues.total },
    //         { where: { id: user.id } }
    //       );
    //     });
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };
    
    // calculateTotalExpense();

    const users = await User.findAll({
      attributes: ['name', 'totalExpense'],
      order: [['totalExpense', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
}