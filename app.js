const db = new Dexie('DoorsDatabase');
db.version(1).stores({ users: "id++,username,lastname,role" });
db.open();

class UsersDAO {
  get() {
    return db.users.toArray();
  }

  static getInstance() {
    return new UsersDAO();
  }
}

Vue.use(window.vuelidate.default);
Vue.use(validators);
const { required, maxLength, minLength, between } = validators;

const app = new Vue({
  el: '#app',
  data: {
    productId: 0,
    db: null,
    customMarker: mainIcon,
    circle: {
      center: [59.938955, 30.315644],
      radius: 200000,
      color: 'transparent',
      fillColor: 'transparent'
    },
    marker: {
      position: {
        lat: 59.938955,
        lon: 30.315644
      }
    },
    polygons: polygons,
    url: OPEN_SOURCE_MAP,
    attribution: MAP_ATTRIBUTE,
    mapOptions: mapOptions,
    form: {
      door: {
        width: '',
        height: '',
        depth: ''
      },
      doorone: {
        width: '',
        height: '',
        depth: '',
      }
    },
    exterriorForm: {
      door: {
        width: '',
        height: '',
      },
      doorone: {
        width: '',
        height: '',
      }
    },
    jamb: JAMB.DEFAULT,
    planc: '',
    menu: false,
    page: Pages.INTERRIOR,
    map: null,
    token: "b9d7ff047d4bb709323e74c77668854649019f04",
    adress: 'no-adress',
    zone: {
      title: 'Первая зона',
      price: 0
    },
    interriorTabs: interriorTabs.SERVICES,
    doorCovering: [...covering],
    amountForm: {
      covering: 3500,
      narrowSide: null,
      narrowTop: null,
      expandSide: null,
      expandTop: null,
      jamb: null,
    },
    cart: [],
    modalAddCart: false,
    cartAmount: null,
    addItemCount: 1,
    typeMaterial: false,
    typeRepairDoor: covering[0].title,
    finalAmount: {
      map: null,
      oneDoors: 0,
      doubleDoors: null,
      enamelAndWoodDoors: null,
      expandOther: null,
      expandBeton: null,
      narrow: null,
      jambs: null,
    }
  },
  methods: {
    getDoorRepairInCart(cart, price) {
      const oneDoors = cart.slice().filter((item) => item.amountForm.covering === price);
      if (oneDoors.length) {
        return oneDoors;
      }

      return null;
    },
    deleteCartItem(id) {
      const [cart] = this.cart.slice().filter((item) => item.id === id);
      this.finalAmount = {
        oneDoors: cart.amountForm.covering === 3500 ? this.finalAmount.oneDoors - 1 : this.finalAmount.oneDoors,
        doubleDoors: cart.amountForm.covering === 2950 ? this.finalAmount.doubleDoors - 1 : this.finalAmount.doubleDoors,
        enamelAndWoodDoors: cart.amountForm.covering === 3900 ? this.finalAmount.enamelAndWoodDoors - 1 : this.finalAmount.enamelAndWoodDoors,
        expandOther: cart.typeMaterial === 'OTHER' ? this.finalAmount.expandOther - (cart.amountForm.expandSide + cart.amountForm.expandTop) : this.finalAmount.expandOther,
        expandBeton: cart.typeMaterial === 'BETON' ? this.finalAmount.expandBeton - (cart.amountForm.expandSide + cart.amountForm.expandTop) : this.finalAmount.expandBeton,
        jambs: cart.amountForm.jamb ? this.finalAmount.jambs - cart.amountForm.jamb : this.finalAmount.jambs,
        narrow: this.finalAmount.narrow - (cart.amountForm.narrowTop + cart.amountForm.narrowSide)
      }

      this.cart = this.cart.filter((item) => item.id !== id);
      this.getCartAmount();
    },
    incId(id) {
      this.productId = id + 1;
      return this.productId;
    },
    centerUpdated() {
      this.mapOptions.center = [...this.marker.position];
    },
    getCartAmount() {
      this.cartAmount = this.cart.reduce((acc, item) => acc + item.total, 0);
    },
    incItemCount() {
      this.addItemCount += DEFAULT_CART_ITEM;
    },
    decItemCount() {
      if (this.addItemCount > DEFAULT_CART_ITEM) {
        this.addItemCount -= DEFAULT_CART_ITEM;
      }
    },
    addCalcToTheCart() {
      const { expandSide, expandTop, narrowSide, narrowTop } = this.amountForm;

      let calc = {
        door: { ...this.form.door },
        doorone: { ...this.form.doorone },
        amountForm: { ...this.amountForm },
        total: this.getAmount,
        typeMaterial: !this.typeMaterial ? 'BETON' : 'OTHER',
        typeRepairDoor: this.typeRepairDoor,
        image: `img/${this.amountForm.covering}.jpg`
      }

      let count = this.addItemCount;

      while (count > 0) {
        const id = this.incId(this.productId);
        this.cart.push({ ...calc, id: id });
        const obj = {
          oneDoors: calc.amountForm.covering === 3500 ? this.finalAmount.oneDoors + 1 : this.finalAmount.oneDoors,
          doubleDoors: calc.amountForm.covering === 2950 ? this.finalAmount.doubleDoors + 1 : this.finalAmount.doubleDoors,
          enamelAndWoodDoors: calc.amountForm.covering === 3900 ? this.finalAmount.enamelAndWoodDoors + 1 : this.finalAmount.enamelAndWoodDoors,
          expandOther: this.typeMaterial ? this.finalAmount.expandOther + (expandSide + expandTop) : this.finalAmount.expandOther,
          expandBeton: !this.typeMaterial ? this.finalAmount.expandBeton + (expandSide + expandTop) : this.finalAmount.expandBeton,
          jambs: this.amountForm.jamb ? this.finalAmount.jambs + this.amountForm.jamb : this.finalAmount.jambs,
          narrow: this.finalAmount.narrow + narrowSide + narrowTop
        }

        this.finalAmount = { ...obj };
        count--;
      }

      this.addItemCount = DEFAULT_CART_ITEM;

      this.form = {
        door: {
          width: '',
          height: '',
          depth: ''
        },
        doorone: {
          width: '',
          height: '',
          depth: '',
        }
      };

      this.changeCoveringType(DEFAULT_INTERRIOR_TYPE_ID);

      this.amountForm = {
        covering: this.doorCovering[0].price,
        narrowSide: null,
        narrowTop: null,
        expandSide: null,
        expandTop: null,
        jamb: null,
      },

        this.cartAmount = null;
      this.typeRepairDoor = covering[0].title;
      this.$v.$reset();
      this.showAndHideModalAddCart();
      this.getCartAmount();
    },
    showAndHideModalAddCart() {
      if (document.body.style.overflow !== 'hidden') {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
      this.modalAddCart = !this.modalAddCart;
    },
    priceFormat(price) {
      return Number(price).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
    },
    addCalculate() {
      const form = [];
    },
    changeCoveringType(id) {
      this.doorCovering.forEach((item) => {
        if (item.id === id) {
          item.active = true;
          this.amountForm.covering = item.price;
          this.typeRepairDoor = item.title;
          return;
        }

        if (item.id !== id) {
          item.active = false;
          return;
        }
      })
    },
    changeInterriorTabs() {
      if (this.interriorTabs === interriorTabs.SERVICES) {
        this.interriorTabs = interriorTabs.OPTIONAL;
      } else {
        this.interriorTabs = interriorTabs.SERVICES;
      }
    },
    closeMenu() {
      if (this.menu) {
        this.menu = false;
      }
    },
    mapClick(event) {
      this.marker.position = { ...event.latlng };
    },
    getPolygon(polygon) {
      if (!polygon) {
        this.zone.title = null;
        this.zone.price = null;
      } else {
        this.zone.title = polygon.title;
        this.zone.price = polygon.price;
      }

      return this.zone;
    },
    doSomethingOnReady() {
      this.map = this.$refs.myMap.mapObject
    },
    navigate(evt) {
      evt.preventDefault();
      if (evt.target.dataset.link) {
        this.page = evt.target.dataset.link;
      }
    },
    getDoorOneWidthBetween(value, minVal, maxVal) {
      const min = value - 120;
      const max = value + 120;

      if (value >= 100) {
        return between(min, max);
      }

      return between(minVal, maxVal);
    }
  },
  components: {
    'l-map': window.Vue2Leaflet.LMap,
    'l-tile-layer': window.Vue2Leaflet.LTileLayer,
    'l-marker': window.Vue2Leaflet.LMarker,
    'l-polygon': window.Vue2Leaflet.LPolygon,
    'l-circle': window.Vue2Leaflet.LCircle,
    'l-icon': window.Vue2Leaflet.LIcon,
  },
  computed: {
    hours() {
      const hour = dayjs().get('hour');
      return hour < DayTime.MIN || hour >= 18;
    },
    dinamicPin() {
      if (this.zone.price !== null) {
        return this.customMarker.iconUrl;
      }

      return this.customMarker.iconUrlNothing;
    },
    dynamicSize() {
      return [this.customMarker.width, this.customMarker.height];
    },
    dynamicAnchor() {
      return [this.customMarker.width / 2, this.customMarker.height];
    },
    getDooroneDepthMeters() {
      return Math.ceil(this.form.doorone.depth / 100);
    },
    expansionOpeningTop() {
      const price = this.typeMaterial ? wallMaterial.OTHER : wallMaterial.BETON;
      const meters = this.getDooroneDepthMeters ? this.getDooroneDepthMeters : 1;

      if (this.getTopExtention) {
        return this.amountForm.expandTop = price * meters;
      }

      return this.amountForm.expandTop = null;
    },
    expansionOpeningTheSide() {
      const price = this.typeMaterial ? wallMaterial.OTHER : wallMaterial.BETON;
      const value = this.form.doorone.width - this.form.door.width;
      const meters = this.getDooroneDepthMeters ? this.getDooroneDepthMeters * 2 : 2;

      if (value < 20 && this.getSideExtention) {
        return this.amountForm.expandSide = price * meters;
      }

      return this.amountForm.expandSide = null;
    },
    reducingOpeningTheSide() {
      const value = this.form.doorone.width - this.form.door.width
      if (value <= 90 && value > 60 && this.getSideNarrow) {
        return this.amountForm.narrowSide = NARROW_PRICE * 2;
      }

      if (value > 90 && this.getSideNarrow) {
        return this.amountForm.narrowSide = NARROW_PRICE * 4;
      }

      return this.amountForm.narrowSide = null;
    },
    reducingOpeningTop() {
      if (this.getTopNarrow) {
        return this.amountForm.narrowTop = NARROW_PRICE;
      }

      return this.amountForm.narrowTop = null;
    },
    jambPrice() {
      if (this.getJambRepair) {
        return this.amountForm.jamb = JAMB_PRICE * this.getJambCount;
      }

      return this.amountForm.jamb = null;
    },
    getAmount() {
      return Object.values(this.amountForm).reduce((acc, el) => el += acc, 0);
    },
    getWidthValid() {
      if (!this.$v.form.door.width.$invalid && !this.$v.form.doorone.width.$invalid) {
        return true;
      }

      return false;
    },
    getHeightValid() {
      if (!this.$v.form.door.height.$invalid && !this.$v.form.doorone.height.$invalid) {
        return true;
      }

      return false;
    },
    getSideExtention() {
      const extention = this.form.doorone.width - this.form.door.width;

      if (this.getWidthValid && extention < 20) {
        return extention || true;
      }

      return null;
    },
    getTopExtention() {
      const extention = this.form.doorone.height - this.form.door.height;

      if (this.getHeightValid && extention < 10) {
        return extention || true;
      }

      return null;
    },
    getSideNarrow() {
      const narrow = this.form.doorone.width - this.form.door.width;

      if (this.getWidthValid && narrow > 60) {
        return true;
      }

      return null;
    },
    getTopNarrow() {
      const narrow = this.form.doorone.height - this.form.door.height;

      if (this.getHeightValid && narrow > 30) {
        return true;
      }

      return null;
    },
    getJamb() {
      const divergence = this.form.doorone.depth - this.form.door.depth;

      if (divergence > 0) {
        return divergence;
      }

      return false;
    },
    getJambRepair() {
      if (this.getJamb && this.jamb === JAMB.DEFAULT) {
        return this.getJamb > 2 ? this.getJamb : false;
      }

      if (this.getJamb && this.jamb === JAMB.TELESCOPE) {
        return this.getJamb > 15 ? this.getJamb : false;
      }
    },
    getCuttJamb() {
      const divergence = this.planc * this.getJambCount;

      if (this.getJambCount && this.getJambRepair) {
        return divergence - this.getJamb !== 2;
      }

      return false;
    },
    getJambCount() {
      if (this.planc) {
        return Math.ceil((this.getJamb + 2) / this.planc);
      }

      return false;
    },
  },
  validations() {
    return {
      form: {
        door: {
          width: {
            required,
            between: this.getDoorOneWidthBetween(this.form.doorone.width, 620, 1480)
          },
          height: {
            required,
            between: between(2020, 2100)
          },
          depth: {
            required,
            between: between(68, 80)
          }
        },
        doorone: {
          width: {
            required,
            between: this.getDoorOneWidthBetween(this.form.door.width, 600, 1500)
          },
          height: {
            required,
            between: between(2000, 2130)
          },
          depth: {
            required,
            between: between(68, 450)
          }
        }
      },
      exterriorForm: {
        door: {
          width: {
            required,
            between: this.getDoorOneWidthBetween(this.exterriorForm.doorone.width, 620, 1200)
          },
          height: {
            required,
            between: between(2020, 2100)
          }
        },
        doorone: {
          width: {
            required,
            between: this.getDoorOneWidthBetween(this.exterriorForm.door.width, 600, 1300)
          },
          height: {
            required,
            between: between(2000, 2130)
          },
        }
      }
    }
  },
  async mounted() {
    const users = await UsersDAO.getInstance().get();
    console.log(users);
  }
})

// function getOptions(token, query) {
//   return {
//     method: "POST",
//     mode: "cors",
//     headers: {
//       "Content-Type": "application/json",
//       "Accept": "application/json",
//       "Authorization": "Token " + token
//     },
//     body: JSON.stringify(query)
//   }
// };

    // getAddres() {
    //   const query = { lat: this.marker.position.lat, lon: this.marker.position.lng };
    //   const options = getOptions(this.token, query);

    //   fetch(url, options)
    //     .then(response => response.text())
    //     .then(result => this.adress = JSON.parse(result).suggestions[0].unrestricted_value)
    //     .catch(error => console.log("error", error));
    // },