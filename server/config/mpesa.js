import axios from 'axios';
import moment from 'moment';
import dotenv from 'dotenv';

dotenv.config();

const consumerKey = process.env.MPESA_CONSUMER_KEY;
const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
const shortcode = process.env.MPESA_SHORTCODE;
const lipaNaMpesaOnlinePasskey = process.env.MPESA_PASSKEY;
const lipaNaMpesaOnlineURL = process.env.MPESA_ONLINE_URL;
const callbackURL = process.env.MPESA_CALLBACK_URL;

const getAccessToken = async () => {
  const auth = new Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const { data } = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  return data.access_token;
};

export const initiateSTKPush = async (phoneNumber, amount, accountReference, transactionDesc) => {
  const accessToken = await getAccessToken();
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = new Buffer.from(`${shortcode}${lipaNaMpesaOnlinePasskey}${timestamp}`).toString('base64');

  const payload = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackURL,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc,
  };

  const { data } = await axios.post(lipaNaMpesaOnlineURL, payload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data;
};
