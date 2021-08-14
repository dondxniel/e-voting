require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require("mongoose");
const adminRoutes = require("./routes/admin");
const jsonDataRoutes = require("./routes/jsonData");
const partiesRoutes = require("./routes/parties");
const electionRoutes = require("./routes/election");
const authRoutes = require("./routes/auth");
const voterRoutes = require("./routes/voter");
const path = require("path");

const app = express();
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Database connected successfully.'))
.catch(err => console.log(`Database connection error: ${err}`))

app.use(cors());
app.use(express.json());
app.use('/admin', adminRoutes);
app.use('/json', jsonDataRoutes);
app.use('/parties', partiesRoutes);
app.use('/election', electionRoutes);
app.use('/auth', authRoutes);
app.use('/voter', voterRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    })
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
