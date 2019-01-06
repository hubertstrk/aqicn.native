<template>
  <Page @loaded="onLoaded" backgroundColor="#3c495e">
    <ActionBar title="Air Quality Index" class="action-bar">
      <ActionItem @tap="onLoaded()"
      ios.systemIcon="13" ios.position="right"
      android.systemIcon="ic_menu_share" android.position="actionBar" />
    </ActionBar>

    <ScrollView orientation="vertical">
      <StackLayout>
        <Image :src="photo" loadMode="async" />
        <StackLayout v-if="usedStation" class="content">
          
          <Label textWrap="true" class="h1" :text="city"></Label>
          <Label textWrap="true" class="h2" :text="area"></Label>

          <GridLayout rows="100, 100" columns="*, *" class="section">
            <BlockLabel row="0" col="0" backgroundColor="#0f2b4b" :text="getValue(aqi)" description="AQI" ></BlockLabel>
            <BlockLabel row="0" col="1" backgroundColor="#448865" :text="getValue(pressure)" description="Pressure"></BlockLabel>
            <BlockLabel row="1" col="0" backgroundColor="#86c078" :text="getValue(no2)" description="NO2"></BlockLabel>
            <BlockLabel row="1" col="1" backgroundColor="#9fdeb4" :text="getValue(o3)" description="O3"></BlockLabel>
          </GridLayout>

          <Label textWrap="true" class="footnote text-right font-italic" :text="time"></Label>

          <Label textWrap="true" class="h1" text="Level"></Label>
          <Label textWrap="true" class="h3" :text="level"></Label>

          <Label textWrap="true" class="h1" text="Description"></Label>
          <Label textWrap="true" class="h3" :text="description"></Label>

        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import axios from 'axios'
import {isEnabled, enableLocation, getLocation} from '../js/location'

import BlockLabel from './BlockLabel'

const geolocation = require('nativescript-geolocation')

export default {
  data() {
    return {
      token: 'e528c09ab86a80f586e637b49c827957a734fb3f',
      usedStation: null,
      pressure: 0,
      aqi: 0,
      no2: 0,
      o3: 0,
      time: null,
      photo: null,
      photos: [ 
        'https://c2.staticflickr.com/8/7810/32716249988_c9372c3dcc_z.jpg', 
        'https://c2.staticflickr.com/8/7806/44758722720_f1ce7ebb76_z.jpg',
        'https://c1.staticflickr.com/5/4822/45856598474_607e5140fe_z.jpg',
        'https://c2.staticflickr.com/8/7897/31648509197_4968284c82_z.jpg',
        'https://c2.staticflickr.com/8/7839/32741648258_c2c500e8d3_z.jpg',
        'https://c2.staticflickr.com/8/7890/31673081187_2aefb13e48_z.jpg',
        'https://c1.staticflickr.com/5/4911/39648744533_a2ede5a669_z.jpg'
      ]
    }
  },
  components: {
    BlockLabel
  },
  methods: {
    requestAqi ({latitude, longitude}) {
      const url = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${this.token}`
      // const url = `https://api.waqi.info/feed/here/?token=${this.token}`
      // console.info(`requesting aqi: ${url}`)
      axios.get(url)
      .then(res => res.data.data)
      .then((data) => {
        // console.info(data)
        this.usedStation = data.city.name
        
        if (data.iaqi.p) this.pressure = Math.round(data.iaqi.p.v)
        if (data.iaqi.pm10) this.aqi = data.iaqi.pm10.v
        if (data.iaqi.no2) this.no2 = this.no2 = data.iaqi.no2.v
        if (data.time.s) this.s = this.time = data.time.s
        if (data.iaqi.o3) this.o3 = this.o3 = data.iaqi.o3.v
      })
    },
    getValue (value) {
      return value === null || value === 0 ? '-' : value
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
      const random = Math.floor(Math.random() * this.photos.length)
      this.photo = this.photos[random]

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
  },
  computed: {
    city () {
      if (!this.usedStation) return
      return this.usedStation.split(',')[0]
    },
    area () {
      if (!this.usedStation) return
      const array = this.usedStation.split(',')
      array.shift()
      return array.join(', ')
    },
    level () {
      if (this.aqi > 0 && this.aqi <= 50) return 'Good'
      else if (this.aqi > 50 && this.aqi <= 100) return 'Moderate'
      else if (this.aqi > 100 && this.aqi <= 150) return 'Unhealthy for Sebsitive Groups'
      else if (this.aqi > 150 && this.aqi <= 200) return 'Unhealty'
      else if (this.aqi > 200 && this.aqi <= 300) return 'Very Unhealty'
      else 'Hazardous'
    },
    description () {
      if (this.aqi > 0 && this.aqi <= 50) return 'Air quality is considered satisfactory, and air pollution poses little or no risk'
      else if (this.aqi > 50 && this.aqi <= 100) return 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution'
      else if (this.aqi > 100 && this.aqi <= 150) return 'Members of sensitive groups may experience health effects. The general public is not likely to be affected'
      else if (this.aqi > 150 && this.aqi <= 200) return 'Air quality is considered satisfactory, and air pollution poses little or no risk'
      else if (this.aqi > 200 && this.aqi <= 300) return 'Air quality is considered satisfactory, and air pollution poses little or no risk'
      else 'Health alert: everyone may experience serious health effects'
    }
  }
}
</script>

<style scoped>
ActionBar {
  background-color: #292929;
}
Page {
  color: white;
  /* font-family: 'Montserrat-Light'; */
}
.content {
  margin: 0 10px;
}
.section {
  margin: 5px 0;
}
</style>
