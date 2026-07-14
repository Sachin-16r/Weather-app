alert("JavaScript Loaded");
const weatherData = {
    delhi: {
        city: "Delhi",
        temp: 34,
        condition: "Sunny",
        humidity: 42,
        wind: 12,
        icon: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
        background: "image/delhi.jpeg"
    },
    mumbai: {
        city: "Mumbai",
        temp: 30,
        condition: "Cloudy",
        humidity: 78,
        wind: 18,
        icon: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
        background: "image/mumbai.jpeg"
    },
    kolkata: {
        city: "Kolkata",
        temp: 31,
        condition: "Rainy",
        humidity: 85,
        wind: 20,
        icon: "https://cdn-icons-png.flaticon.com/512/3351/3351979.png",
        background: "image/kolkata.jpeg"
    },
    chennai: {
        city: "Chennai",
        temp: 33,
        condition: "Partly Cloudy",
        humidity: 68,
        wind: 15,
        icon: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
        background: "image/chennai.jpeg"
    },
    bengaluru: {
        city: "Bengaluru",
        temp: 26,
        condition: "Cloudy",
        humidity: 65,
        wind: 10,
        icon: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
        background: "image/bang.jpeg"
    },
    hyderabad: {
        city: "Hyderabad",
        temp: 29,
        condition: "Sunny",
        humidity: 50,
        wind: 11,
        icon: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
        background: "image/hydr.jpeg"
    },
    pune: {
        city: "Pune",
        temp: 27,
        condition: "Partly Cloudy",
        humidity: 60,
        wind: 14,
        icon: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
        background: "image/pune.jpeg"
    },
    jaipur: {
        city: "Jaipur",
        temp: 36,
        condition: "Sunny",
        humidity: 30,
        wind: 17,
        icon: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
        background: "image/jaipur.jpeg"
    },
    ahmedabad: {
        city: "Ahmedabad",
        temp: 35,
        condition: "Hot",
        humidity: 35,
        wind: 16,
        icon: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
        background: "image/ahme.jpeg"
    },
    lucknow: {
        city: "Lucknow",
        temp: 32,
        condition: "Cloudy",
        humidity: 58,
        wind: 13,
        icon: "https://cdn-icons-png.flaticon.com/512/414/414825.png",
        background: "image/luck.jpeg"
    }
};

function getWeather() {

    const cityInput = document.getElementById("city").value.trim().toLowerCase();

    if (cityInput === "") {
        alert("Please enter a city name.");
        return;
    }
    document.querySelector(".weather-card").style.display = "block";
    const weather = weatherData[cityInput];

    if (weather) {
        const container = document.querySelector("body");
        container.style.backgroundImage = `url('${weather.background}')`;
        container.style.backgroundSize = "cover";
        container.style.backgroundPosition = "center";
        container.style.backgroundRepeat = "no-repeat";

        document.getElementById("cityName").textContent = weather.city;
        document.getElementById("temp").textContent = weather.temp + "°C";
        document.getElementById("condition").textContent = weather.condition;
        document.getElementById("humidity").textContent = weather.humidity + "%";
        document.getElementById("wind").textContent = weather.wind + " km/h";
        document.getElementById("icon").src = weather.icon;

    } else {

        document.getElementById("cityName").textContent = "City Not Found";
        document.getElementById("temp").textContent = "--°C";
        document.getElementById("condition").textContent = "--";
        document.getElementById("humidity").textContent = "--%";
        document.getElementById("wind").textContent = "-- km/h";
        document.getElementById("icon").src = "";

    }
}