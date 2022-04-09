import { initializeApp } from 'firebase/app';

// Initialize Firebas.
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: "flower-shop-api.firebaseapp.com",
    databaseURL: "https://flower-shop-api-default-rtdb.firebaseio.com",
    projectId: "flower-shop-api",
    storageBucket: "flower-shop-api.appspot.com",
    messagingSenderId: "739252802805",
    appId: "1:739252802805:web:b96ab312cb4ea502ace1bc"
  };
  
const app = initializeApp(firebaseConfig);

export default app;
