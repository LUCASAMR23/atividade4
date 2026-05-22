const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const router = require("./routes/sena.routes");

dotenv.config({
  quiet: true,
  path: path.resolve(__dirname, "..", ".env"),
});

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

app.listen(PORT, function () {
  console.log(`Rodando em http://localhost:${PORT}`);
});

const publicPath = path.join(__dirname, "..", "public");
const pagesPath = path.join(publicPath, "pages");
const assetsPath = path.join(publicPath, "assets");

app.get("/", express.static(pagesPath));
app.use("/assets", express.static(assetsPath));
app.use("/senas", router);