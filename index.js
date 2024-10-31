require('dotenv').config()
const express = require('express')
const app = express();
const router=require("./routes/user");
var cors = require('cors');
const connectDB=require("./database/db");
const cookieparser=require("cookie-parser");


const port = process.env.PORT || 3000;


app.use(cors())
app.use(express.json());
app.use(cookieparser());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));   



// user api
app.use("/api/user",router)



app.get('/', (req, res) => {
  res.send('Hello World!')
})
connectDB().then(()=>{
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}).catch((err)=>{
  console.log(err)
})

