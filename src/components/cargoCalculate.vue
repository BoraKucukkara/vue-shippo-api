<template>
  <div class="container py-2 px-0">
    <form @submit.prevent="onSubmit">
      <div class="card shadow col-12 col-lg-8 offset-lg-2">
        <div class="card-header d-flex flex-column flex-lg-row justify-content-between align-items-center">
          <div class="fw-bold fs-3 text-secondary">Shippo-API</div>
          <div class="lead">Shipping Rates</div>
        </div>

        <div class="card-body">
          <div class="row">
            <div class="col col-6">
              <select v-model="postData.address_from.country" class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                <option selected>From</option>
                <option value="US" selected>USA</option>
              </select>
            </div>
            <div class="col col-6">
              <select v-model="postData.address_to.country" @change="adressUpdate" class="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                <option selected>To</option>
                <option value="US">USA</option>
                <option value="CA">CANADA</option>
                <option value="MX">MEXICO</option>
                <option value="AU">AUSTRALIA</option>
                <option value="DE">GERMANY</option>
                <option value="NL">HOLLAND</option>
                <option value="ES">SPAIN</option>
                <option value="FR">FRANCE</option>
                <option value="SG">SINGAPORE</option>
                <option value="JP">JAPAN</option>
              </select>
            </div>
            <Transition name="fade">
              <div class="col col-12 col-lg-6 offset-lg-6 pb-3" v-if="postData.address_to.country === 'US'">
                <label for="zipcode" class="form-label">Postal Code</label>
                <input v-model="postData.address_to.zip" @focus="postData.address_to.zip = ''" type="number" class="form-control border-primary" id="zipcode">
              </div>
            </Transition>
          </div>
          <div class="row">
            <div class="col col-lg-3 col-6">
              <label for="uzunluk" class="form-label">Length (in)</label>
              <input v-model="pLength" type="number" class="form-control" id="uzunluk">
            </div>
            <div class="col col-lg-3 col-6">
              <label for="genislik" class="form-label">Width (in)</label>
              <input v-model="pWidth" type="number" class="form-control" id="genislik">
            </div>
            <div class="col col-lg-3 col-6">
              <label for="yukseklik" class="form-label">Height (in)</label>
              <input v-model="pHeight" type="number" class="form-control" id="yukseklik">
            </div>
            <div class="col col-lg-3 col-6">
              <label for="agirlik" class="form-label">Weight (lb)</label>
              <input v-model="pWeight" type="number" class="form-control" id="agirlik">
            </div>
          </div>
          <div class="d-flex py-4 justify-content-center">
            <button type="submit" class="btn col-12 py-2 fs-4 col-lg-6 rounded-pill btn-lg btn-success"
                    :class="{'progress-bar-striped progress-bar-animated': loading}">{{ loading ? 'Loading' : 'Calculate' }} <i v-if="loading" class="fa-solid fa-spinner fa-spin-pulse"></i></button>
          </div>
          <!--/////////////// PARCEL VOLUME INFO //////////////-->
          <div class="d-flex justify-content-center">
            <span class="lead py-2" v-show="info">{{info}}</span>
            <Transition name="fade">
              <span class="lead py-2" v-if="parcelVolume > 0 && info.length < 1" >Total Volume: {{parcelVolume}} in³ <i class="fa-solid fa-box-open"></i></span>
            </Transition>
          </div>
          <!--/////////////// end of PARCEL VOLUME INFO //////////////-->
        </div>
        <div class="d-flex p-4 bg-light justify-content-between align-items-start" v-if="this.responseStatus === 'SUCCESS' && responseData.length > 0">
          <span class="lead text-secondary"><i class="fa-solid fa-truck-fast text-secondary"></i> Carriers</span>
          <span class="lead fw-bold text-secondary">Prices</span>
        </div>
        <div v-if="responseData.length === 0 && this.responseStatus === 'SUCCESS'" class="m-3 alert shadow-sm bg-light border text-center" role="alert">
          <i class="fa-solid fa-circle-exclamation"></i> <strong>No suitable carrier found.</strong> Please check the data you entered or try again.
        </div>
        <!--/////////////// SHIPPING RATES //////////////-->

        <ul v-for="rates in responseData" :key="rates" class="list-group px-1 list-group-flush border-bottom-0">
          <li class="list-group-item d-flex justify-content-between align-items-center list-fade" style="min-height: 5rem">
            <img :src="rates.provider_image_200" width="40" :alt="rates.provider">
            <div class="ms-2 me-auto">
              <div class="fw-bold">{{rates.provider}} <span class="fw-normal">{{ rates.servicelevel.name }}</span></div>
              <div class="text-secondary">{{ rates.duration_terms ? rates.duration_terms : rates.servicelevel.name }}</div>
            </div>
            <div class="justify-content-end" style="min-width: 5rem">
              <span class="fs-3 px-1 text-success text-monospace fw-bolder">{{ parcelVolume < 4000 ? Math.ceil(rates.amount * 1.1) : Math.ceil(rates.amount * 1.4) }} </span>
              <span class="m-0 p-1 badge bg-light text-secondary ">{{rates.currency}}</span>
            </div>
          </li>
        </ul>
        <!--/////////////// end of SHIPPING RATES //////////////-->
      </div>
    </form>

  </div>
</template>
<script>
import axios from "axios"
export default {
  data(){
    return {
      postData: {
        address_to : {
          name: "Mr Hippo",
          street1: "965 Mission St #572",
          city: "Dover",
          state: "DE",
          zip: "19904",
          country: "AU",
          phone: "4151234567",
          email: "mrhippo@goshippo.com"
        },
        address_from : {
          name: "Mrs Hippo",
          street1: "25 Gristmill Dr",
          city: "Dover",
          state: "DE",
          zip: "19904",
          country: "US",
          phone: "4159876543",
          email: "mrshippo@goshippo.com"
        },
        extra:{
          insurance: {
            currency: "USD",
            amount: "1"
          }
        },
        parcels: [],
        async: "false",
      },
      responseData : [],
      pLength: "",
      pWidth: "",
      pHeight: "",
      pWeight: "",
      info: "",
      loading: false,
      parcelVolume: "",
      responseStatus: "",
    }
  },
  methods : {
    onSubmit(){
      this.totalVolume();
      this.responseData = []
      this.responseStatus = ""
      this.info = ""
      this.loading = true
      this.postData.parcels.splice(0) //
      this.postData.parcels.push({length: this.pLength, width: this.pWidth, height: this.pHeight, distance_unit: "in", weight: this.pWeight, mass_unit: "lb", test: "true"})
      //this.jsonData = JSON.stringify(this.postData);
      axios.post("https://api.goshippo.com/shipments/",{ ...this.postData } )
          .then(response => {
            this.info = ""
            this.loading = false
            this.responseData = response.data.rates
            this.responseStatus = response.data.status
          })
          // api error response
          .catch(error => {
            this.loading = false
            this.info = "Please check the data you entered or try again."
            console.log(error)
          })
    },
    // Some random zip, city and state info for each country. This data can also be requested from the user
    adressUpdate(){
      if(this.postData.address_to.country === "CA") { // CANADA
        this.postData.address_to.zip = "N2L 3G1"
        this.postData.address_to.state = "ON"
        this.postData.address_to.city = "Waterloo"
      } else if(this.postData.address_to.country === "US") { // UNITED STATES
        this.postData.address_to.state = "DE"
        this.postData.address_to.city = "Dover"
      } else if(this.postData.address_to.country === "AU") { // AUSTRALIA
        this.postData.address_to.zip = "2009"
        this.postData.address_to.state = "NSW"
        this.postData.address_to.city = "Sydney"
      } else if(this.postData.address_to.country === "NL") { // NEDERLAND
        this.postData.address_to.zip = "1019"
        this.postData.address_to.state = "NH"
        this.postData.address_to.city = "Amsterdam"
      } else if(this.postData.address_to.country === "ES") { // NEDERLAND
        this.postData.address_to.zip = "08075"
        this.postData.address_to.state = "CA"
        this.postData.address_to.city = "Barcelona"
      } else if(this.postData.address_to.country === "JP") { // JAPAN
        this.postData.address_to.zip = "543-0062"
        this.postData.address_to.state = "CA"
        this.postData.address_to.city = "Osaka"
      } else if(this.postData.address_to.country === "MX") { // MEXICO
        this.postData.address_to.zip = "84955"
        this.postData.address_to.state = "CA"
        this.postData.address_to.city = "La Labor"
      } else if(this.postData.address_to.country === "FR") { // FRANCE
        this.postData.address_to.zip = "75001"
        this.postData.address_to.state = "CA"
        this.postData.address_to.city = "Paris"
      } else if(this.postData.address_to.country === "DE") { // FRANCE
        this.postData.address_to.zip = "10115"
        this.postData.address_to.state = "CA"
        this.postData.address_to.city = "Berlin"
      }
    },
    totalVolume() {
      this.parcelVolume = this.pLength * this.pWidth * this.pHeight
    }
  },
}
</script>