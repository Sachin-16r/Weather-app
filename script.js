const cityInput = document.getElementById("city");
const weatherCard = document.querySelector(".weather-card");
const errorMessage = document.getElementById("error");

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        errorMessage.textContent = "Please enter a city name.";
        weatherCard.style.display = "none";
        return;
    }

    errorMessage.textContent = "Loading...";

    try {
        /* CITY */
        const loc = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        ).then(r => r.json());

        if (!loc.results?.length) throw new Error("City not found");

        const place = loc.results[0];
        const { latitude, longitude } = place;

        /* WEATHER */
        const weather = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
            `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,is_day` +
            `&daily=sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`
        ).then(r => r.json());

        /* AIR QUALITY */
        const air = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}` +
            `&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`
        ).then(r => r.json());

        const c = weather.current;
        const d = weather.daily;
        const a = air.current;

        /* CITY */
        set("cityName",
            `${place.name}${place.admin1 ? ", " + place.admin1 : ""}${place.country_code ? ", " + place.country_code : ""}`
        );

        /* MAIN WEATHER */
        set("temp", `${Math.round(c.temperature_2m)}°C`);
        set("humidity", `${c.relative_humidity_2m}%`);
        set("wind", `${Math.round(c.wind_speed_10m)} km/h`);

        const info = weatherInfo(c.weather_code, c.is_day);
        set("icon", info.icon);
        set("condition", info.text);

        /* DETAILS */
        set("feelsLike", `${Math.round(c.apparent_temperature)}°C`);
        set("windDirection", `${windDirection(c.wind_direction_10m)} (${Math.round(c.wind_direction_10m)}°)`);
        set("windGust", `${Math.round(c.wind_gusts_10m)} km/h`);
        set("rain", `${num(c.rain)} mm`);
        set("showers", `${num(c.showers)} mm`);
        set("snow", `${num(c.snowfall)} cm`);
        set("cloud", `${c.cloud_cover}%`);
        set("pressure", `${Math.round(c.pressure_msl)} hPa`);
        set("visibility", `${(c.visibility / 1000).toFixed(1)} km`);

        /* SUN */
        set("sunrise", time(d.sunrise?.[0]));
        set("sunset", time(d.sunset?.[0]));

        /* UV */
        const uv = Number(d.uv_index_max?.[0]);
        set("uv", Number.isFinite(uv) ? uv.toFixed(1) : "--");
        set("uvText", Number.isFinite(uv) ? uvLevel(uv) : "--");

        /* RAIN CHANCE */
        set(
            "rainChance",
            d.precipitation_probability_max?.[0] != null
                ? `${d.precipitation_probability_max[0]}%`
                : "--"
        );

        /* OPEN-METEO AQI */
        const aqi = Number(a.us_aqi);

        if (Number.isFinite(aqi)) {
            set("aqi", Math.round(aqi));
            set("aqiText", aqiStatus(aqi));
            setAQIColor(aqi);
        } else {
            set("aqi", "--");
            set("aqiText", "Unavailable");
            resetAQIColor();
        }

        /* POLLUTANTS */
        set("pm25", `${num(a.pm2_5)} µg/m³`);
        set("pm10", `${num(a.pm10)} µg/m³`);
        set("co", `${num(a.carbon_monoxide)} µg/m³`);
        set("no2", `${num(a.nitrogen_dioxide)} µg/m³`);
        set("so2", `${num(a.sulphur_dioxide)} µg/m³`);
        set("o3", `${num(a.ozone)} µg/m³`);

        weatherCard.style.display = "block";
        errorMessage.textContent = "";

    } catch (error) {
        console.error(error);
        weatherCard.style.display = "none";
        errorMessage.textContent = "Unable to get weather.";
    }
}

/* WEATHER */
function weatherInfo(code, day) {
    const x = {
        0: ["Clear", day ? "☀️" : "🌙"],
        1: ["Mostly Clear", day ? "🌤️" : "🌙"],
        2: ["Partly Cloudy", "⛅"],
        3: ["Cloudy", "☁️"],
        45: ["Foggy", "🌫️"],
        48: ["Foggy", "🌫️"],
        51: ["Drizzle", "🌦️"],
        53: ["Drizzle", "🌦️"],
        55: ["Drizzle", "🌦️"],
        56: ["Freezing Drizzle", "🌧️"],
        57: ["Freezing Drizzle", "🌧️"],
        61: ["Rain", "🌧️"],
        63: ["Rain", "🌧️"],
        65: ["Heavy Rain", "🌧️"],
        66: ["Freezing Rain", "🌧️"],
        67: ["Freezing Rain", "🌧️"],
        71: ["Snow", "❄️"],
        73: ["Snow", "❄️"],
        75: ["Heavy Snow", "❄️"],
        77: ["Snow", "❄️"],
        80: ["Rain Showers", "🌦️"],
        81: ["Rain Showers", "🌦️"],
        82: ["Heavy Rain", "🌧️"],
        85: ["Snow Showers", "🌨️"],
        86: ["Snow Showers", "🌨️"],
        95: ["Thunderstorm", "⛈️"],
        96: ["Thunderstorm", "⛈️"],
        99: ["Thunderstorm", "⛈️"]
    };

    const v = x[code] || ["Weather", "🌤️"];
    return { text: v[0], icon: v[1] };
}


/* WIND */
function windDirection(deg) {
    return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    [Math.round(deg / 45) % 8];
}

/* UV */
function uvLevel(uv) {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
}

/* OPEN-METEO AQI */
function aqiStatus(aqi) {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
}

function resetAQIColor() {
    const box = document.querySelector(".aqi-box");
    if (box) box.className = "aqi-box";
}

/* HELPERS */
function set(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function num(value) {
    return Number.isFinite(Number(value))
        ? Number(value).toFixed(1)
        : "--";
}

function time(value) {
    return value
        ? new Date(value).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })
        : "--";
}

/* ENTER */
cityInput.addEventListener("keydown", e => {
    if (e.key === "Enter") getWeather();
});
/*color aqi box */
function setAQIColor(aqi) {
    const box = document.querySelector(".aqi-box");
    if (!box) return;

    box.style.background = "";

    if (aqi <= 50) {
        box.style.background = "#00E400";
    }
    else if (aqi <= 100) {
        box.style.background = "#FFFF00";
    }
    else if (aqi <= 200) {
        box.style.background = "#FF7E00";
    }
    else if (aqi <= 300) {
        box.style.background = "#FF0000";
    }
    else if (aqi <= 400) {
        box.style.background = "#99004C";
    }
    else {
        box.style.background = "#7E0023";
    }
}