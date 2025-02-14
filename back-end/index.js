import express from "express";
import connectDB from "./config/dbStarter.js";
import formRoutes from "./routes/formRoutes.js"

connectDB();

const app = express();

//Middleware setup should be done first then.. 
app.use(express.json());

// this should be done next
app.use("/api/forms", formRoutes);


const port = process.env.PORT || 5000 ;
app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})


