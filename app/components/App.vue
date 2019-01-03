<template>
  <Page @loaded="onLoaded">
    <ActionBar title="Foo"/>
    <FlexboxLayout flexDirection="column" backgroundColor="#3c495e">
      <Label :text="aqi" />
    </FlexboxLayout>
  </Page>
</template>

<script>
import axios from 'axios'
import {isEnabled, enableLocation, getLocation} from '../js/location'

const geolocation = require("nativescript-geolocation")

export default {
  data() {
    return {
      token: 'e528c09ab86a80f586e637b49c827957a734fb3f',
      usedStation: '',
      pressure: 0,
      aqi: 0
    }
  },
  methods: {
    requestAqi ({latitude, longitude}) {
      const url = `https://api.waqi.info/feed/geo:${longitude};${latitude}/?token=${this.token}`
      console.info(`requesting aqi: ${url}`)
      axios.get(url)
      .then(res => res.data.data)
      .then((data) => {
        this.usedStations = data.city.name
        this.pressure = data.iaqi.p.v
        this.aqi = data.iaqi.pm10.v
      })
    },
    confirmLocation () {
      return confirm({
        title: 'Location',
        message: 'GPS location is not available. Switch it on now?',
        okButtonText: 'Yes',
        cancelButtonText: 'No'
      })
    },
    onLoaded () {
      isEnabled().then((enabled) => {
        if (!enabled) {
          this.confirmLocation().then((confirmed) => {
            if (confirmed) {
              getLocation().then(location => this.requestAqi(location))
            }
          })
        } else {
          getLocation().then(location => this.requestAqi(location))
        }
      })
    }
  }
}
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}

.message {
  vertical-align: center;
  text-align: center;
  font-size: 20;
  color: #333333;
}
</style>
