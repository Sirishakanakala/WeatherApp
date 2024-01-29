// OPEN WEATHER API 
// https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=06c06d1f6c61e4eaa6c5d165c6aeaf69}

const http = require("http");
const fs = require("fs");
var requests = require("requests");
const homeFile = fs.readFileSync("home.html","utf-8");

const replaceVal = (tempVal, orgVal) => {
    console.log("Original value:", tempVal);
    console.log("Temperature:", orgVal.main.temp);
    console.log("Min Temperature:", orgVal.main.temp_min);
    console.log("Max Temperature:", orgVal.main.temp_max);
    console.log("Location:", orgVal.name);
    console.log("Country:", orgVal.sys.country);
    console.log("Temperature Status:", orgVal.weather[0].main);

    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

    console.log("Modified value:", temperature);
    
    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        fs.readFile("home.html", "utf-8", (err, homeFile) => {
            if (err) {
                console.log("Error reading home.html:", err);
                res.end();
                return;
            }

            requests("https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&units=metric&appid=06c06d1f6c61e4eaa6c5d165c6aeaf69")
                .on("data", (chunk) => {
                    const objdata = JSON.parse(chunk);
                    const arrData = [objdata];
                    const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                    res.write(realTimeData);
                })
                .on("end", (err) => {
                    if (err) return console.log("connection closed due to errors", err);
                    res.end();
                });
        });
    }
});

server.listen(5500, "127.0.0.1", () => {
    console.log('Server is running on port 8001');
});
