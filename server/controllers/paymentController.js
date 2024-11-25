const { initiateSTKPush } = require('../config/mpesa'); // Adjust the path as necessary

const makePayment = async (req, res) => {
  const { phoneNumber, amount, accountReference, transactionDesc } = req.body;

  try {
    const response = await initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc);
    res.json(response);
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).send('Error initiating payment');
  }
};

module.exports = {
  makePayment,
};