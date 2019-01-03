<template>
  <Page>
    <ActionBar title="Foo"/>
    <FlexboxLayout flexDirection="column" backgroundColor="#3c495e">
      <Button text="Nearest Station" @tap="searchNearestStations" />
      <Label :text="usedStation" />
      <TextView :text="measurements" />
    </FlexboxLayout>
  </Page>
</template>

<script>
import axios from 'axios'
const geolocation = require("nativescript-geolocation")

// PM10 refers to particulate matter that is 10 micrograms per cubic metre or less in diameter. PM10 is generally subdivided into a fine fraction of particles 2.5 micrograms per cubic metre or less (PM2.5) and a coarse fraction of particles larger than 2.5 micrograms per cubic metre.
// PM10 are referred to as “inhalable coarse particles” and are found near roadways and dusty industries.
// PM2.5 are “fine particles” found in smoke and haze and can be directly emitted from sources such as forest fires. They also form when gases emitted from power plants, industries, and automobiles react in the air.5

export default {
  data() {
    return {
      token: 'e528c09ab86a80f586e637b49c827957a734fb3f',
      usedStation: '',
      measurements: ''
    }
  },
  methods: {
    searchNearestStations () {
      const url = `https://api.waqi.info/feed/geo:49.013432;12.101624/?token=${this.token}`
      axios.get(url)
      .then(res => res.data.data)
      .then((data) => {
        this.usedStation = data.city.name
        console.info(data.iaqi)
        this.measurements = `Coarse Particles: ${data.iaqi.pm10.v}\nAir Pressure: ${data.iaqi.p.v}\nNitrogen Dioxide: ${data.iaqi.no2.v}`
      })
    },
    // enableLocationTap (args) {
    //   geolocation.isEnabled()
    //     .then((isEnabled) => {
    //       if (!isEnabled) {
    //         geoLocation.enableLocationRequest()
    //           .then(() => {}, error => console.log("Error: " + (error.message || error)))
    //       }
    //     })


    //   geolocation.isEnabled().then(function (isEnabled) {
    //     if (!isEnabled) {
    //       geolocation.enableLocationRequest().then(function () {
    //       }, function (e) {
    //         console.log("Error: " + (e.message || e));
    //         });
    //       }
    //     }, function (e) {
    //         console.log("Error: " + (e.message || e));
    //     });
    // }
  },
  components: {
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
