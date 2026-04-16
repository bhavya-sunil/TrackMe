const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {cors:{origin:'*'}});

app.use(express.json());
const path = require("path");

app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/driver", express.static(path.join(__dirname, "../driver")));


let liveBusLocations = {};

// Sample route data
let routes = {
  "route18": [
    [17.3850, 78.4867],
    [17.3950, 78.4967],
    [17.4050, 78.5067],
    [17.4150, 78.5167]
  ],
  "route44": [
    [17.3700, 78.4800],
    [17.3800, 78.4900],
    [17.3900, 78.5000],
    [17.4000, 78.5100]
  ]
};

io.on("connection", socket => {
  console.log("Client connected");

  socket.on("updateBusLocation", data => {
    liveBusLocations[data.busId] = data;
    io.emit("busLocationUpdate", liveBusLocations);
  });

  socket.on("getRoute", routeId => {
    if(routes[routeId]) socket.emit("routeData", routes[routeId]);
  });
});

app.get("/api/findBus", (req,res)=>{
  const bus = req.query.busNumber;
  if(liveBusLocations[bus]) return res.json({found:true, busId:bus});
  return res.json({found:false});
});

http.listen(3000, ()=>console.log("✅ Server running on port 3000..."));
