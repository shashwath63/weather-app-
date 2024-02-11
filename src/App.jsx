import "./App.css";
import React, { useState,useEffect } from "react";
import axios from "axios";
import locationIcon from "./assets/location.svg";
import ToDateFunction from "./ToDataFunction";
function App() {
  const [input, setInput] = useState("");
  const [forecast, setForecast] = useState([]);
  const [weather, setWeather] = useState({
    data: {},
    error: false,
  });
  // Call fetchForecast when the component mounts or when certain state changes
  useEffect(() => {
    fetchForecast();
  }, []); // Empty dependency array means this effect runsonce on mount

  // Function to fetch forecast data
  const fetchForecast = async (input) => {
    const url = "https://api.openweathermap.org/data/2.5/forecast";
    const api_key = "f00c38e0279b7bc85480c3fe775d518c"; // Replace with your actual API key
    try {
      const response = await axios.get(url, {
        params: {
          q: input,
          units: "metric",
          appid: api_key,
        },
      });
      setForecast(processForecastData(response.data.list));
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };
  // Function to process and extract the forecast data for the next 5 days at noon
  const processForecastData = (data) => {
    const dailyData = [];
    for (let i = 0; i < data.length; i += 8) {
      // 8 data points for 24 hours
      const timestamp = data[i].dt;
      const date = new Date(timestamp * 1000);
      if (date.getHours() === 12) {
        // Check if the time is around 12:00 PM
        dailyData.push({
          date: date.toDateString(),
          time: date.toLocaleTimeString(),
          temp: Math.round(data[i].main.temp),
        });
      }
    }
    return dailyData.slice(0, 5); // Return only the next 5 days
  };

  // Function to convert Unix timestamp to local time
  const convertUnixTimeToLocalTime = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);
    return date.toLocaleTimeString();
  };

  const Search = async (event) => {
    if (event.key === "Enter") {
      fetchForecast(input); // Call fetchForecast with the current input value

      event.preventDefault();
      setInput("");
      setWeather({ ...weather, loading: true });
      const url = "https://api.openweathermap.org/data/2.5/weather";
      const api_key = "f00c38e0279b7bc85480c3fe775d518c";
      await axios
        .get(url, {
          params: {
            q: input,
            units: "metric",
            appid: api_key,
          },
        })
        .then((res) => {
          console.log("res", res);
          setWeather({ data: res.data, error: false });
        })
        .catch((error) => {
          setWeather({ ...weather, data: {}, error: true });
          setInput("");
          console.log("error", error);
        });
    }
  };
  return (
    <div className="bg-gray-200 w-screen h-screen ">
      <div className="HEADER-DIV container flex mx-auto p-6 bg-gray-400 ">
        <h1 className="text-2xl font-bold text-gray-700 my-4 ml-44">
          Weather Dashboard
        </h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className=" flex-grow border-2 focus:outline-none focus:ring-2 border-neutral-800 rounded-lg p-3  ml-3 "
            value={input}
            onChange={(event) => setInput(event.target.value)}
            name="query"
            onKeyDown={Search}
          />
          <button className="text-white font-bold py-2 px-4 bg-gray-400 hover:bg-blue-100 border-2 border-black ml-3 rounded-lg transition-colors duration-200 ease-in-out">
            <img src={locationIcon} alt="Location Icon" className="w-6 h-6" />
          </button>
          <button></button>
        </div>
      </div>

      <br />
      <div className="container ml-44 p-6 flex flex-row">
        <div className="justify-center text-white border-gray-800 h-65 w-60 rounded-lg border-2  shadow-lg bg-sky-950 ">
          {weather.error && (
            <div className="text-center py-10">
              <span className="text-xl text-red-500">City not found</span>
            </div>
          )}

          {weather && weather.data && weather.data.main && (
            <div className="text-center">
              <h2 className=" font-bold text-white my-4 ">
                <img
                  className=" pl-8 "
                  src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                  alt={weather.data.weather[0].description}
                />
                <div className=" justify-center align-center mb-4">
                  <span className="text-5xl">
                    {Math.round(weather.data.main.temp)}
                  </span>
                  <sup className="text-2xl">°C</sup>
                </div>
                {weather.data.name},{" "}
                <span>
                  {weather.data.sys.country}
                  {weather.data.sys.state}
                </span>
              </h2>

              <div className="text-lg mb-4 ml-4">
                <span>{ToDateFunction()}</span>
              </div>

              <div className="uppercase m-4">
                <p>{weather.data.weather[0].description.toUpperCase()}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col h-65  w-60 m-2 ">
          {weather && weather.data && weather.data.main && (
            <div className=" border-2 border-gray-800 rounded-lg p-6 h-40 w-40 m-4 bg-sky-950 text-white shadow-lg">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">Humidity</h3>
                <p className="text-5xl">
                  {weather.data.main.humidity}
                  <span className="text-2xl"> %</span>
                </p>
              </div>
            </div>
          )}
          {weather && weather.data && weather.data.main && (
            <div className=" border-2 border-gray-800 rounded-lg p-6 h-40 w-40 m-4 -mt-0 bg-sky-950 text-white shadow-lg">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">
                  Wind Speed
                </h3>
                <p className="text-2xl"> {weather.data.wind.speed} m/s</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col h-65  w-60 m-2  ">
          {weather && weather.data && weather.data.main && (
            <div className="border-2 border-gray-800 rounded-lg p-6  h-40 w-40 m-4 -ml-16 bg-sky-950 text-white shadow-lg">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">Pressure</h3>
                <p className="text-2xl">
                  {weather.data.main.pressure}
                  <span className="text-2xl"> hPa</span>
                </p>
              </div>
            </div>
          )}
          {weather && weather.data && weather.data.visibility && (
            <div className="border-2 border-gray-800 rounded-lg p-6  h-40 w-40 m-4 -ml-16 -mt-0 bg-sky-950 text-white shadow-lg">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">
                  Visibility
                </h3>
                <p className="text-2xl">
                  {(weather.data.visibility / 1000).toFixed(2)}
                  <span className="text-2xl"> km</span>
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col h-65  w-60 m-2  ">
          {weather && weather.data && weather.data.main && (
            <div className="border-2 border-gray-800 rounded-lg p-6  h-40 w-40 m-4 -ml-30 -ml-36 bg-sky-950 text-white shadow-lg">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">Sunrise</h3>
                <p className="text-2xl">
                  {convertUnixTimeToLocalTime(weather.data.sys.sunrise)}
                </p>
              </div>
            </div>
          )}
          {weather && weather.data && weather.data.visibility && (
            <div className="border-2 border-gray-800 rounded-lg p-6  h-40 w-40 m-4 -ml-36 -mt-0 bg-sky-950 text-white shadow-lg">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">Sunset</h3>
                <p className="text-2xl">
                  {convertUnixTimeToLocalTime(weather.data.sys.sunset)}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">
            5-Day Forecast
          </h2>
          <div className="flex justify-center gap-4">
            {forecast.map((day, index) => (
              <div
                key={index}
                className="border-2 border-gray-800 rounded-lg p-6 bg-white shadow-lg"
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    {day.date}
                  </h3>
                  <p className="text-lg">{day.time}</p>
                  <p className="text-5xl">
                    {day.temp}
                    <span className="text-2xl">°C</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
