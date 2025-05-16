import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import initWebRoutes from "./routes/web.js"

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// middleware for cookies
app.use(cookieParser());

initWebRoutes(app);

let port = process.env.PORT || 4040;
app.listen(port, () => {
    console.log(`App is running at port ${port}`);
});