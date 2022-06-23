const express = require("express");
const serverless = require("serverless-http");
const app = express();
// const credentials = new AWS.SharedIniFileCredentials({profile: "dob_profile",});

app.use(express.json());
app.get("/status", (req, res) => res.json({ status: "ok", sns: sns }));
app.post("/send", (req, res) => {
  var mysql = require("mysql");
  var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  connection.query(`
        SELECT
            BIN_TO_UUID(product_id) as product_id
            , name, price, stock, BIN_TO_UUID(factory_id) as factory_id, BIN_TO_UUID(ad_id) as ad_id
        FROM product
        WHERE sku = '${req.body.MessageAttributeProductId}';
        `,
    function (error, results, fields) {
        if (error) {
          return res.status(500).send({ message: error });
        }
        console.log("The stock is: ", results[0].stock);
        const sql = `
                UPDATE product
                SET stock = stock + ${req.body.MessageAttributeProductCnt || 0}
                WHERE product_id = UUID_TO_BIN('${results[0].product_id}');
                `;
        console.log(sql);
        connection.query(sql, function (error, results2, fields) {
          if (error)
          return res.status(500).send({ message: error });


        });
        console.log("상품 입고 !!");
        return res.status(200).send({ message: "입고완료" });
      }

  );
});
module.exports.handler = serverless(app);