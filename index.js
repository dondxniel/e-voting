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
const voteRoutes = require("./routes/vote");
const numRegVotersRoutes = require("./routes/numRegVoters");
const history = require("./routes/history");
const path = require("path");
const { Server } = require("socket.io"); //Socket importation

const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,//true,
    useUnifiedTopology: true
})
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.log(`Database connection error: ${err}`))

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/admin', adminRoutes);
app.use('/json', jsonDataRoutes);
app.use('/parties', partiesRoutes);
app.use('/election', electionRoutes);
app.use('/auth', authRoutes);
app.use('/voter', voterRoutes);
app.use('/numRegVoters', numRegVotersRoutes);
app.use('/history', history);

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    })
}

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

// io initialization
const io = new Server(server, {
    cors: {
        // origin: "http://localhost:3000",//socketUrl,
        method: ["GET", "POST"]
    }
})
// passing io as a request property to enable it to be used in routes
app.use((req, res, next) => {
    req.io = io;
    next();
})
app.use('/vote', voteRoutes);

// listening for the connection event
io.on("connection", socket => {

    console.log(`Socket connected ${socket.id}`)

    socket.on('join_room', payload => {
        socket.join(payload);
    })

    socket.on('message_sent', payload => {
        socket.to(payload.room).emit('message_recieved', payload)
        console.log('Emit worked')
    })

    socket.on("disconnect", () => {
        console.log("User disconnected from socket.")
    })
})
