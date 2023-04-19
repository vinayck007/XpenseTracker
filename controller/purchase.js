const User = require('../models/user')
const Razorpay = require('razorpay');
const Order = require('../models/orders')


const purchasepremium =async (req, res) => {
  try {
  
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    })
    const amount = 2500;
    console.log (rzp)

    rzp.orders.create({amount, currency: "INR"}, (err, order) => {
      console.log(order)
      if(err) {
        throw new Error(JSON.stringify(err));
      }
      req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(() => {
        return res.status(201).json({ order, key_id: rzp.key_id});
      }).catch(err => {
        console.log(err);
        throw new Error(err);
      })
  })
  
} catch (err) {
  console.log(err);
}
}

 const updateTransactionStatus = (req, res ) => {
    try {
        const { payment_id, order_id} = req.body;
        Order.findOne({where : {orderid : order_id}}).then(order => {
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                req.user.update({ispremiumuser: true})
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            }).catch((err)=> {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }
}

const leaderboard = async (req, res) => {

  try {

    const calculateTotalExpense = async () => {
      try {
        const users = await User.findAll({
          include: [
            {
              model: Expense,
              attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
            },
          ],
          group: ['User.id'],
        });
    
        users.forEach(async (user) => {
          await User.update(
            { totalexpense: user.Expenses[0].dataValues.total },
            { where: { id: user.id } }
          );
        });
      } catch (err) {
        console.error(err);
      }
    };
    
    calculateTotalExpense();

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

module.exports = {
    purchasepremium,
    updateTransactionStatus,
    leaderboard
}