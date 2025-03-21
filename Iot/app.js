/*
        WORKING CODE FOR Displaying arduino data to terminal
*/
// const { SerialPort, ReadlineParser } = require('serialport');
// const io = require('socket.io')(3000);

// const parser = new ReadlineParser({
//     delimiter: '\r\n'
// });

// const port = new SerialPort({
//     path: 'COM5', 
//     baudRate: 9600,
//     dataBits: 8,
//     parity: 'none',
//     stopBits: 1,
//     flowControl: false
// });
// port.pipe(parser);

// console.log('Listening for data from Arduino...');
// parser.on('data', function (data) {
//     console.log('Received data from port: ' + data);
//     let parsedData = parseSensorData(data);

//     if (parsedData) {
//         io.emit('data', parsedData);
//     } else {
//         console.log('Invalid or incomplete data received.');
//     }
// });

// function parseSensorData(data) {
//     if (data.includes('Temperature:')) {
//         let tempMatch = data.match(/Temperature:\s*([\d.]+)\s*°C/);
//         let humMatch = data.match(/Humidity:\s*([\d.]+)\s*%/);
//         let soilMatch = data.match(/Soil Moisture:\s*(\d+)\s*%/);

//         if (tempMatch && humMatch && soilMatch) {
//             return {
//                 temperature: parseFloat(tempMatch[1]),
//                 humidity: parseFloat(humMatch[1]),
//                 soilMoisture: parseInt(soilMatch[1], 10)
//             };
//         }
//     } else if (data.includes('Failed to read from DHT sensor!')) {
//         return {
//             error: 'DHT sensor read failed'
//         };
//     }
//     return null;
// }
// port.on('error', function (err) {
//     console.log('Error: ', err.message);
// });

















// Import required modules
// const http = require('http');
// const fs = require('fs');
// const SerialPort = require('serialport');
// const socketIo = require('socket.io');

// // Read the HTML file (updated for Krishi Hub)
// const index = fs.readFileSync('index.html');

// // Define SerialPort settings (COM5 for Windows)
// const port = new SerialPort('COM5', {
//     baudRate: 9600,      // Baud rate for communication
//     dataBits: 8,        // Number of data bits
//     parity: 'none',     // No parity bit
//     stopBits: 1,        // 1 stop bit
//     flowControl: false  // No flow control
// });

// // Create a parser to read incoming serial data
// const parser = new SerialPort.parsers.Readline({
//     delimiter: '\r\n'  // Data is split by new lines
// });

// // Pipe the data to the parser
// port.pipe(parser);

// // Create the HTTP server and serve the HTML file
// const app = http.createServer(function (req, res) {
//     res.writeHead(200, { 'Content-Type': 'text/html' });
//     res.end(index); // Serve the HTML page
// });

// // Create a WebSocket connection using Socket.io
// const io = socketIo(app);

// // When a client connects to the WebSocket
// io.on('connection', function (socket) {
//     console.log('✅ Client connected to WebSocket');
// });

// // Listen for incoming serial data from Arduino
// parser.on('data', function (data) {
//     console.log('📡 Received data from Arduino: ' + data);

//     try {
//         // Parse incoming data (assuming JSON format from Arduino)
//         const sensorData = JSON.parse(data);

//         // Validate data format
//         if (
//             sensorData.temperature !== undefined &&
//             sensorData.humidity !== undefined &&
//             sensorData.soilMoisture !== undefined
//         ) {
//             io.emit('data', {
//                 temperature: sensorData.temperature,
//                 humidity: sensorData.humidity,
//                 soilMoisture: sensorData.soilMoisture
//             });
//         } else {
//             console.error('⚠️ Invalid data format:', data);
//             io.emit('data', { error: 'Invalid data format from Arduino!' });
//         }
//     } catch (error) {
//         console.error('❌ Error parsing data:', error.message);
//         io.emit('data', { error: 'Failed to parse data from Arduino!' });
//     }
// });

// // Start the HTTP server on port 3000
// app.listen(3000, () => {
//     console.log('🚀 Server running at http://localhost:3000/');
//     console.log('🔌 Listening on Serial Port: COM5');
// });


// 






























// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const { SerialPort, ReadlineParser } = require('serialport');
// const socketIo = require('socket.io');

// const server = http.createServer((req, res) => {
//     fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
//         if (err) {
//             res.writeHead(500);
//             return res.end('Error loading index.html');
//         }
//         res.writeHead(200, { 'Content-Type': 'text/html' });
//         res.end(data);
//     });
// });

// const io = socketIo(server);

// const parser = new ReadlineParser({ delimiter: '\r\n' });
// const port = new SerialPort({
//     path: 'COM5',  // Adjust based on your system
//     baudRate: 9600,
//     dataBits: 8,
//     parity: 'none',
//     stopBits: 1,
//     flowControl: false
// });

// port.pipe(parser);

// console.log('Listening for data from Arduino...');
// parser.on('data', (data) => {
//     console.log('Received data:', data);
//     let parsedData = parseSensorData(data);
//     if (parsedData) {
//         io.emit('sensorData', parsedData);
//     }
// });

// function parseSensorData(data) {
//     let tempMatch = data.match(/Temperature:\s*([\d.]+)\s*°C/);
//     let humMatch = data.match(/Humidity:\s*([\d.]+)\s*%/);
//     let soilMatch = data.match(/Soil Moisture:\s*(\d+)\s*%/);

//     if (tempMatch && humMatch && soilMatch) {
//         return {
//             temperature: parseFloat(tempMatch[1]),
//             humidity: parseFloat(humMatch[1]),
//             soilMoisture: parseInt(soilMatch[1], 10)
//         };
//     }
//     return null;
// }

// port.on('error', (err) => {
//     console.error('Serial Port Error:', err.message);
// });

// io.on('connection', (socket) => {
//     console.log('Client connected');
// });

// server.listen(3000, () => {
//     console.log('Server listening on port 3000');
// });





















// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const express = require('express');  // Use Express for better handling
// const { SerialPort, ReadlineParser } = require('serialport');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(express.static(path.join(__dirname))); // Serve static files (index.html)

// const parser = new ReadlineParser({ delimiter: '\r\n' });
// const port = new SerialPort({
//     path: 'COM5',  // Adjust based on your system
//     baudRate: 9600,
//     dataBits: 8,
//     parity: 'none',
//     stopBits: 1,
//     flowControl: false
// });

// port.pipe(parser);

// console.log('Listening for data from Arduino...');
// parser.on('data', (data) => {
//     console.log('Received data:', data);
//     let parsedData = parseSensorData(data);
//     if (parsedData) {
//         io.emit('sensorData', parsedData);
//     }
// });

// function parseSensorData(data) {
//     let tempMatch = data.match(/Temperature:\s*([\d.]+)\s*°C/);
//     let humMatch = data.match(/Humidity:\s*([\d.]+)\s*%/);
//     let soilMatch = data.match(/Soil Moisture:\s*(\d+)\s*%/);

//     if (tempMatch && humMatch && soilMatch) {
//         return {
//             temperature: parseFloat(tempMatch[1]),
//             humidity: parseFloat(humMatch[1]),
//             soilMoisture: parseInt(soilMatch[1], 10)
//         };
//     }
//     return null;
// }

// port.on('error', (err) => {
//     console.error('Serial Port Error:', err.message);
// });

// io.on('connection', (socket) => {
//     console.log('Client connected');
// });

// server.listen(3000, () => {
//     console.log('Server running at http://localhost:3000');
// });
















const { SerialPort, ReadlineParser } = require('serialport');
const http = require('http');
const fs = require('fs');
const socketIo = require('socket.io');

// Create HTTP server
const server = http.createServer((req, res) => {
    fs.readFile('index.html', (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
});

// Attach Socket.io to server
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Setup SerialPort and parser
const parser = new ReadlineParser({ delimiter: '\r\n' });
const port = new SerialPort({
    path: 'COM5',  // Change this to match your Arduino's port
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

port.pipe(parser);

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('🌐 A client connected');
    
    socket.on('disconnect', () => {
        console.log('🔌 A client disconnected');
    });
});

// Store sensor data until we have all three values
let sensorData = {
    temperature: null,
    humidity: null,
    soilMoisture: null
};

parser.on('data', (data) => {
    console.log('📊 Received data:', data);
    
    // Parse individual sensor readings
    let tempMatch = data.match(/Temperature:\s*([\d.]+)\s*°C/);
    let humMatch = data.match(/Humidity:\s*([\d.]+)\s*%/);
    let soilMatch = data.match(/Soil Moisture:\s*(\d+)\s*%/);
    
    // Update our sensorData object with any new values
    if (tempMatch) {
        sensorData.temperature = parseFloat(tempMatch[1]);
    }
    if (humMatch) {
        sensorData.humidity = parseFloat(humMatch[1]);
    }
    if (soilMatch) {
        sensorData.soilMoisture = parseInt(soilMatch[1], 10);
    }
    
    // If we have all three values, emit the data
    if (sensorData.temperature !== null && 
        sensorData.humidity !== null && 
        sensorData.soilMoisture !== null) {
        
        console.log('🚀 Sending data to clients:', sensorData);
        io.emit('sensorData', sensorData);
    }
});

// Handle serial port errors
port.on('error', (err) => {
    console.error('❌ Serial Port Error:', err.message);
});

// Start server on port 3000
server.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
});