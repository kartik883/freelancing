const Razorpay = require('razorpay');
require('dotenv').config();

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID.replace(/['"]+/g, "").trim(),
  key_secret: process.env.RAZORPAY_SECRET.replace(/['"]+/g, "").trim(),
});

console.log("Testing keys...");
console.log("Key ID prefix:", rzp.key_id.substring(0, 9));
console.log("Key ID length:", rzp.key_id.length);
console.log("Key Secret length:", rzp.key_secret.length);


rzp.orders.create({
  amount: 100,
  currency: "INR",
  receipt: "test_receipt"
}).then(order => {
  console.log("Success! Order created:", order.id);
}).catch(err => {
  console.error("Failed!", err);
});
