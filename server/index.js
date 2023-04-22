const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    origin: "*",
  })
);

const SSLCommerzPayment = require("sslcommerz-lts");
const store_id = "shaki644405c339e67";
const store_passwd = "shaki644405c339e67@ssl";
const is_live = false; //true for live, false for sandbox

const port = 3030;

//sslcommerz validation

async function validate(req, res, next) {
  const data = {
    val_id: req.body, //that you go from sslcommerz response
  };
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.validate(data).then((data) => {
    //process the response that got from sslcommerz
    // https://developer.sslcommerz.com/doc/v4/#order-validation-api
    console.log("from validate", req.body.val_id);
    console.log("from validate", data.status);
    if (data.status == "VALID") {
      next();
    } else {
      return res.send({ status: false, message: "transection not complete" });
    }
  });
  // console.log("from validate error", req.body.val_id);
  // return res.send({ error: "error" });
}

app.get("/", (req, res) => {
  res.send({ result: "running" });
});
//sslcommerz init
app.get("/init", (req, res) => {
  const data = {
    total_amount: 100,
    currency: "BDT",
    tran_id: "REF123",
    success_url: `http://localhost:3030/ssl-payment-success`,
    fail_url: `http://localhost:3030/ssl-payment-fail`,
    cancel_url: `http://localhost:3030/ssl-payment-cancel`,
    shipping_method: "No",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "cust@yahoo.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    multi_card_name: "mastercard",
    value_a: "ref001_A",
    value_b: "ref002_B",
    value_c: "ref003_C",
    value_d: "ref004_D",
    ipn_url: `${process.env.ROOT}/ssl-payment-notification`,
  };

  const sslcommerz = new SSLCommerzPayment(store_id, store_passwd, false);
  sslcommerz.init(data).then((data) => {
    if (data?.GatewayPageURL) {
      return res.status(200).redirect(data?.GatewayPageURL);
    } else {
      return res.status(400).json({
        message: "Session was not successful",
      });
    }
  });
});

app.post("/ssl-payment-success", validate, async (req, res) => {
  return res.status(200).json({
    data: req.body,
    message: "Payment success",
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
