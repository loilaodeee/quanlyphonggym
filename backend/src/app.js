const express=require("express");
const cors=require("cors");

const app=express();
const testRoute=require("./routes/testRoutes");
const packageRoutes=require("./routes/packageRoutes");
const authRoutes=require("./routes/authRoutes");
const trainerRoute=require("./routes/trainerRoutes");
const serviceRoutes=require("./routes/serviceRoutes");
const userRoutes=require("./routes/userRoutes");
const paymentRoutes=require("./routes/paymentRoutes");
const memberRoute=require("./routes/memberRoutes");
const trainerPackageRoutes=require("./routes/trainerPackageRoutes");
const employeeRoutes=require("./routes/employeeRoutes");

const trainerRoutes=require("./routes/trainer/trainerRoutes");
app.use(cors());

app.use(express.json());

app.use("/api/test",testRoute);
app.use("/api/packages", packageRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/trainers", trainerRoute);
app.use("/api/services", serviceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/member", memberRoute);
app.use("/api/trainer-packages", trainerPackageRoutes)
app.use("/uploads", express.static("uploads"));

app.use("/api/employee", employeeRoutes);
app.use("/api/trainer", trainerRoutes);
module.exports=app;