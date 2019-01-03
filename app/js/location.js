var location = require("nativescript-geolocation")

const options = {
  desiredAccuracy: 3,
  updateDistance: 10,
  maximumAge: 20000,
  timeout: 2000
}

export const isEnabled = () => {
  return location.isEnabled().then(enabled => enabled, error)
}

export const enableLocation = () => {
  return location.enableLocationRequest().then(() => {
    return true
  }, error)
}

export const getLocation = () => {
  return location.getCurrentLocation(options).then((currentLocation) => {
    return currentLocation }
  , error)
}

const error = (error) => {
  console.error(`Error: ${error.message || error}`)
}