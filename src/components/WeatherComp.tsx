import { useTheme } from "@/context/ThemeContext";
import useIsRTL from "@/hooks/useIsRTL";
import { Colors, commonColors, ThemeType } from "@/styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import TextComp from "./TextComp";
import { ActivityIndicator, View, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { moderateScale } from "@/styles/scaling";
import { StyleSheet } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

interface WeatherCompProps {
  style?: ViewStyle;
}

interface WeatherData {
  temperature: number;
  weatherStatus: string;
  humidity: number;
  highTemperature: number;
  lowTemperature: number;
}

interface WeatherResponse {
  base: string;
  clouds: { all: number };
  cod: number;
  coord: { lat: number; lon: number };
  dt: number;
  id: number;
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  sys: {
    country: string;
    id: number;
    sunrise: number;
    sunset: number;
    type: number;
  };
  timezone: number;
  visibility: number;
  weather: {
    description: string;
    icon: string;
    id: number;
    main: string;
  };
  wind: {
    deg: number;
    speed: number;
  };
}

/* example response
{"base": "stations", "clouds": {"all": 0}, "cod": 200, "coord": {"lat": 25.3464, "lon": 51.4242}, "dt": 1745802298, "id": 289888, "main": {"feels_like": 302.54, "grnd_level": 1003, "humidity": 78, "pressure": 1005, "sea_level": 1005, "temp": 300.07, "temp_max": 300.07, "temp_min": 299.02}, "name": "Ar Rayyan", "sys": {"country": "QA", "id": 7614, "sunrise": 1745805623, "sunset": 1745852577, "type": 1}, "timezone": 10800, "visibility": 10000, "weather": [{"description": "clear sky", "icon": "01n", "id": 800, "main": "Clear"}], "wind": {"deg": 0, "speed": 0.51}}
*/

const WeatherComp = ({ style }: WeatherCompProps) => {
  const { theme } = useTheme();
  const isRTL = useIsRTL();
  const styles = useRTLStyles(isRTL, theme);
  const colors = Colors[theme ?? "light"];
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>({
    temperature: 0,
    weatherStatus: "",
    humidity: 0,
    highTemperature: 0,
    lowTemperature: 0,
  });

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=1b1f952dcf40d2a62baf63838ed9aaba`
    );
    const data = await response.json();
    return data as WeatherResponse;
  };

  const convertKelvinToCelsius = (kelvin: number) => {
    return Math.round(kelvin - 273.15);
  };

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      setLoading(true);

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      const weatherData = await fetchWeatherData(
        location.coords.latitude,
        location.coords.longitude
      );
      setWeather({
        temperature: convertKelvinToCelsius(weatherData.main.temp),
        weatherStatus: weatherData.weather[0].main,
        humidity: weatherData.main.humidity,
        highTemperature: convertKelvinToCelsius(weatherData.main.temp_max),
        lowTemperature: convertKelvinToCelsius(weatherData.main.temp_min),
      });
      setLoading(false);
    }

    getCurrentLocation();
  }, []);

  return (
    <LinearGradient
      colors={["#D6ECF4", "#98B0C8", "#5A759B"]}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
      style={[styles.weatherGradient, style]}
    >
      <View style={styles.weatherInfo}>
        {loading ?
          <ActivityIndicator size="large" color={commonColors.primary} />
        : <>
            <View style={styles.textGroup}>
              <TextComp text={`${weather?.temperature}°`} style={styles.temp} />
              <TextComp text={weather?.weatherStatus} style={styles.weatherStatus} />
            </View>
            <View style={styles.textGroup}>
              <TextComp text={`H: ${weather?.highTemperature}°`} style={styles.weatherText} />
              <TextComp text={`L: ${weather?.lowTemperature}°`} style={styles.weatherText} />
            </View>
            <TextComp text={`Humidity: ${weather?.humidity}%`} style={styles.weatherText} />
          </>
        }
      </View>
      <Image source={require("@/assets/images/weather.png")} style={styles.weatherImage} />
    </LinearGradient>
  );
};

const useRTLStyles = (isRTL: boolean, theme?: ThemeType) => {
  const colors = Colors[theme];

  return StyleSheet.create({
    weatherGradient: {
      borderRadius: moderateScale(25),
      padding: moderateScale(20),
      justifyContent: "flex-start",
      alignItems: "center",
      width: "100%",
      flexDirection: "row",
      height: 130,
    },
    weatherImage: {
      width: "50%",
      height: "88%",
      objectFit: "cover",
    },
    weatherInfo: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flex: 1,
      marginRight: moderateScale(20),
    },
    textGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: moderateScale(10),
    },
    temp: {
      fontSize: moderateScale(32),
      fontWeight: "bold",
      color: "#fff",
    },
    weatherStatus: {
      fontSize: moderateScale(22),
      fontWeight: "bold",
      color: "#fff",
    },
    weatherText: {
      fontSize: moderateScale(14),
      color: "#fff",
    },
  });
};

export default WeatherComp;
