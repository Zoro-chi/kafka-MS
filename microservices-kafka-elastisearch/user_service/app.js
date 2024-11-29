const express = require("express");
const authRoute = require("./routes/authRoute");

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json());

app.use("/auth", authRoute);

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
