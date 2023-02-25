const JAMB = {
    DEFAULT: 'DEFAULT',
    TELESCOPE: 'TELESCOPE'
}

const Pages = {
    INTERRIOR: 'INTERRIOR',
    EXTERRIOR: 'EXTERRIOR',
    MAP: 'MAP',
    CART: 'CART',
    LOGIN: 'LOGIN'
}

const OPEN_SOURCE_MAP = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const MAP_ATTRIBUTE = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const initialCoords = {
    lat: 59.938955,
    lng: 30.315644
};

const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
const token = "b9d7ff047d4bb709323e74c77668854649019f04";

const polygons = {
    polygon: {
        title: 'Первая зона',
        latlngs: spbZone1,
        color: 'rgb(255, 255, 0)',
        fillColor: 'rgb(255, 255, 0)',
        price: 0
    },
    polygon2: {
        title: 'Вторая зона',
        latlngs: spbZone2,
        color: 'rgb(255, 0, 0)',
        fillColor: 'rgb(255, 0, 0)',
        price: 400
    },
    polygon3: {
        title: 'Третья зона',
        latlngs: spbZone3,
        color: 'rgb(255, 140, 0)',
        fillColor: 'rgb(255, 140, 0)',
        price: 800
    },
    polygon4: {
        title: 'Четвертая зона',
        latlngs: spbZone4,
        color: 'rgb(0, 255, 255)',
        fillColor: 'rgb(0, 255, 255)',
        price: 1200
    },
    polygon5: {
        title: 'Патая зона',
        latlngs: spbZone5,
        color: 'rgb(0, 128, 0)',
        fillColor: 'rgb(0, 128, 0)',
        price: 1600
    },
    polygon6: {
        title: 'Шестая зона',
        latlngs: spbZone6,
        color: 'rgb(165, 42, 42)',
        fillColor: 'rgb(165, 42, 42)',
        price: 2000
    },
}

const interriorTabs = {
    SERVICES: "SERVICES",
    OPTIONAL: "OPTIONAL",
}

const mainIcon = {
    iconUrl: './img/location.png',
    iconUrlNothing: './img/pin-nothing.svg',
    width: 40,
    height: 40
};

const mapOptions = {
    zoom: 10,
    minZoom: 9,
    maxZoom: 18,
    center: [59.938955, 30.315644],
}

const NARROW_PRICE = 400;
const JAMB_PRICE = 1250;

const covering = [
    {
        id: 1, title: 'Установка одной межкомнатной двери / одинарной раздвижной двери',
        active: true,
        price: 3500,
        priceTitle: 'Установка одной межкомнатной двери / одинарной раздвижной двери'
    },
    {
        id: 2,
        title: 'Установка дверей из массива и эмалированных',
        active: false,
        price: 3900,
        priceTitle: 'Установка дверей из массива и эмалированных'
    },
    {
        id: 3,
        title: 'Установка межкомнатных дверей (от 2-х дверей)',
        active: false, price: 2950,
        priceTitle: 'Установка межкомнатных дверей (от 2-х дверей)'
    },
];

const wallMaterial = {
    BETON: 1000,
    OTHER: 750
};

const DEFAULT_CART_ITEM = 1;
const DEFAULT_INTERRIOR_TYPE_ID = 1;

const DayTime = {
    MIN: 9,
    MAX: 17,
};

const getPolygons = () => polygons;

// const query = { lat: 55.878, lon: 37.653 };

// const options = {
//   method: "POST",
//   mode: "cors",
//   headers: {
//     "Content-Type": "application/json",
//     "Accept": "application/json",
//     "Authorization": "Token " + token
//   },
//   body: JSON.stringify(query)
// }
