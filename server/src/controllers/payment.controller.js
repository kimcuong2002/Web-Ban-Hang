/**
 * Module dependencies.
 */
const stripe = require("stripe")(process.env.STRIPE_KEY);
const { User, Order, Product } = require("../models");

const paymentProcess = async (req, res, next) => {
  const { cart, id } = req.body;
  const user = await User.findOne({ _id: id });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const orderData = cart.map((item) => {
    return {
      _id: item._id,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      userId: user._id,
    };
  });

  const customer = await stripe.customers.create({
    username: user.username,
    metadata: {
      cart: JSON.stringify(orderData),
    },
  });

  const session = await stripe.checkout.sessions.create({
    shipping_address_collection: {
      allowed_countries: ["PK", "IN", "BD"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "usd",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
    ],
    line_items: cart.map((item) => {
      const percentage = item.discount / 100;
      let actualPrice = item.price - item.price * percentage;
      actualPrice = parseFloat(actualPrice);
      actualPrice = actualPrice * 100;
      actualPrice = actualPrice.toFixed(1);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
          },
          unit_amount_decimal: actualPrice,
        },
        quantity: item.quantity,
      };
    }),
    customer: customer.id,
    mode: "payment",
    success_url: `${process.env.CLIENT}/user?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT}/cart`,
  });
  return res.status(200).json({ url: session.url });
};

const checkOutSession = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.ENDPOINTSECRET
    );
    console.log("payment success");
  } catch (err) {
    console.log(err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;

      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    case "checkout.session.completed":
      const data = event.data.object;
      let customer = await stripe.customers.retrieve(data.customer);
      customer = JSON.parse(customer?.metadata?.cart);
      customer.forEach(async (ctr) => {
        try {
          let reviewStatus = false;
          const findOrder = await Order.findOne({
            productId: ctr._id,
            userId: ctr.userId,
          })
            .where("review")
            .equals(true);
          if (findOrder) {
            reviewStatus = true;
          }
          await Order.create({
            productId: ctr._id,
            userId: ctr.userId,
            size: ctr.size,
            color: ctr.color,
            quantities: ctr.quantity,
            address: data.customer_details.address,
            review: reviewStatus,
          });
          const product = await Product.findOne({ _id: ctr._id });
          if (product) {
            let stock = product.stock - ctr.quantity;
            if (stock < 0) {
              stock = 0;
            }
            await Product.findByIdAndUpdate(ctr._id, { stock }, { new: true });
          }
        } catch (error) {
          console.log(error.message);
          return res.status(500).json("Server internal error");
        }
      });
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

const paymentVerify = async (req, res) => {
  const { id } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(id);
    return res.status(200).json({
      msg: "Your payment has verfied successfully",
      status: session.payment_status,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  paymentProcess,
  checkOutSession,
  paymentVerify,
};
