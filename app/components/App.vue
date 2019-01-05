<template>
  <Page @loaded="onLoaded" backgroundColor="#3c495e">
    <ActionBar title="Air Quality Index" class="action-bar">
      <ActionItem @tap="onLoaded()"
      ios.systemIcon="13" ios.position="right"
      android.systemIcon="ic_menu_share" android.position="actionBar" />
    </ActionBar>

    <ScrollView orientation="vertical">
      <FlexboxLayout flexDirection="column">
        <Image :src="photo" loadMode="async" />
        
        <StackLayout row="3" col="0" class="section">
          <AppLabel row="0" col="0" :text="city" large />
          <AppLabel row="1" col="0" :text="area" small />
          <AppLabel row="2" col="0" :text="time" small />
        </StackLayout>

        <GridLayout v-if="usedStation" rows="60" columns="*, *, *, *" class="section">
          <StackLayout row="0" col="0" backgroundColor="#0f2b4b">
            <BlockLabel :text="aqi" description="AQI"></BlockLabel>
          </StackLayout>
          <StackLayout row="0" col="1" backgroundColor="#448865">
            <BlockLabel :text="pressure" description="Pressure"></BlockLabel>
          </StackLayout>
          <StackLayout row="0" col="2" backgroundColor="#86c078">
            <BlockLabel :text="no2" description="NO2"></BlockLabel>
          </StackLayout>
          <StackLayout row="0" col="3" backgroundColor="#9fdeb4">
            <BlockLabel :text="o3" description="O3"></BlockLabel>
          </StackLayout>
        </GridLayout>

        <StackLayout v-if="usedStation" row="0" col="0" class="section">
          <BlockLabel text="Level" :description="level"></BlockLabel>
        </StackLayout>
        <StackLayout v-if="usedStation" row="0" col="0" class="section">
          <BlockLabel text="Implication" :description="description"></BlockLabel>
        </StackLayout>

      </FlexboxLayout>
    </ScrollView>
  </Page>
</template>

<script>
import axios from 'axios'
import {isEnabled, enableLocation, getLocation} from '../js/location'

import AppLabel from './AppLabel'
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
        'https://c2.staticflickr.com/8/7860/45677507625_82c876517b_b.jpg', 
        'https://c2.staticflickr.com/8/7810/32716249988_c9372c3dcc_z.jpg', 
        'https://c2.staticflickr.com/8/7806/44758722720_f1ce7ebb76_z.jpg',
        'https://c1.staticflickr.com/5/4822/45856598474_607e5140fe_z.jpg',
        'https://c2.staticflickr.com/8/7897/31648509197_4968284c82_z.jpg',
        'https://c1.staticflickr.com/5/4874/46537071502_95459083a2_z.jpg',
        'https://c1.staticflickr.com/5/4839/45664097635_c07f3b515d_b.jpg',
        'https://c1.staticflickr.com/5/4880/46372128212_ff34eb26c7_z.jpg',
        'https://c2.staticflickr.com/8/7851/44770415520_a378784ae2_z.jpg'
      ]
    }
  },
  components: {
    AppLabel, BlockLabel
  },
  methods: {
    requestAqi ({latitude, longitude}) {
      const url = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${this.token}`
      // const url = `https://api.waqi.info/feed/here/?token=${this.token}`
      // console.info(`requesting aqi: ${url}`)
      axios.get(url)
      .then(res => res.data.data)
      .then((data) => {
        console.info(data)
        this.usedStation = data.city.name
        this.pressure = Math.round(data.iaqi.p.v)
        this.aqi = data.iaqi.pm10.v
        this.no2 = data.iaqi.no2.v
        this.time = data.time.s
        this.o3 = data.iaqi.o3.v
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
  font-family: 'Montserrat-Light';
}

.section {
  margin: 5px 10px;
}
</style>
