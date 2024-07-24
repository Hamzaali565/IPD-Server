import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://ipd-model.vercel.app"],
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// my imports
import Authentication from "../Routes/Authentications/Auth.mjs";
import Auth from "../Routes/Authentications/Auth.mjs";
import Prod from "../API/Product/Product.mjs";
import MainData from "../Routes/MainRoute/MainRoute.mjs";

// my routes
app.use("/api/v1", Authentication);
app.use("/api/v1", Auth);
app.use("/api/v1", Prod);
app.use("/api/v1", MainData);

//routes import
// import userRouter from "./routes/user.routes.js";
// import healthcheckRouter from "./routes/healthcheck.routes.js";
// import tweetRouter from "./routes/tweet.routes.js";
// import subscriptionRouter from "./routes/subscription.routes.js";
// import videoRouter from "./routes/video.routes.js";
// import commentRouter from "./routes/comment.routes.js";
// import likeRouter from "./routes/like.routes.js";
// import playlistRouter from "./routes/playlist.routes.js";
// import dashboardRouter from "./routes/dashboard.routes.js";

// //routes declaration
// app.use("/api/v1/healthcheck", healthcheckRouter);
// app.use("/api/v1/users", userRouter);
// app.use("/api/v1/tweets", tweetRouter);
// app.use("/api/v1/subscriptions", subscriptionRouter);
// app.use("/api/v1/videos", videoRouter);
// app.use("/api/v1/comments", commentRouter);
// app.use("/api/v1/likes", likeRouter);
// app.use("/api/v1/playlist", playlistRouter);
// app.use("/api/v1/dashboard", dashboardRouter);

// http://localhost:8000/api/v1/users/register

export { app };
