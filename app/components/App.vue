<template>
  <Page @loaded="onLoaded" backgroundColor="#3c495e">
    <ActionBar title="Air Quality Index" class="action-bar">
      <ActionItem @tap="onLoaded"
      ios.systemIcon="13" ios.position="right"
      android.systemIcon="ic_menu_share" android.position="actionBar" />
    </ActionBar>

    <ScrollView orientation="vertical">
      <FlexboxLayout flexDirection="column">
        <Image :src="photo" loadMode="async" />
        <ActivityIndicator v-if="busy" busy="true" @busyChange="onBusyChanged" />
        <FlexboxLayout v-if="usedStation" flexDirection="column" style="padding: 10px;">
          <AppLabel :text="city" large/>
          <AppLabel :text="`${area}, ${country}`" small />
          <AppLabel :text="`Index ${aqi}`" medium />
          <AppLabel :text="`Pressure ${pressure}`" medium />
        </FlexboxLayout>
      </FlexboxLayout>
    </ScrollView>
  </Page>
</template>

<script>
import axios from 'axios'
import {isEnabled, enableLocation, getLocation} from '../js/location'

import AppLabel from './AppLabel'

const geolocation = require('nativescript-geolocation')

export default {
  data() {
    return {
      token: 'e528c09ab86a80f586e637b49c827957a734fb3f',
      usedStation: null,
      pressure: 0,
      aqi: 0,
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
      ],
      busy: false
    }
  },
  components: {
    AppLabel
  },
  methods: {
    requestAqi ({latitude, longitude}) {
      const url = `https://api.waqi.info/feed/geo:${longitude};${latitude}/?token=${this.token}`
      console.info(`requesting aqi: ${url}`)
      axios.get(url)
      .then(res => res.data.data)
      .then((data) => {
        this.usedStation = data.city.name
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
      this.busy = true
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
      }).then(() => {
        this.busy = false
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
      return this.usedStation.split(',')[1]
    },
    country () {
      if (!this.usedStation) return
      return this.usedStation.split(',')[2]
    },
    photo () {
      const random = Math.floor(Math.random() * this.photos.length)
      return this.photos[random]
    }
  }
}
</script>

<style scoped>
ActionBar {
  background-color: #292929;
  color: #ffffff;
}
.hidden {
  display: none;
}
.visible {
  display: block;
}
</style>
