export const environment = {
  production: false,
  firebase: {
    projectId: 'portfolio-388d7',
    appId: '1:1099250426880:web:b3ee163cc56d8a2483e4e5',
    storageBucket: 'portfolio-388d7.firebasestorage.app',
    apiKey: 'AIzaSyCn3v5lsmqAUhqELW1Pq4SykX14idRGnwk',
    authDomain: 'portfolio-388d7.firebaseapp.com',
    messagingSenderId: '1099250426880',
    measurementId: 'G-BC7L4QSQD2'
  },
  recaptchaEnterprise: '6LeBPBQsAAAAAC3YRV94mDDZP-uzCSdmSVlEKfFw',
  emulators: {
    firestore: {
      host: '127.0.0.1',
      port: 8080,
      protocol: 'http'
    },
    functions: {
      host: '127.0.0.1',
      port: 5001,
      protocol: 'http'
    },
    auth: {
      host: '127.0.0.1',
      port: 9099,
      protocol: 'http'
    },
    storage: {
      host: '127.0.0.1',
      port: 9199,
      protocol: 'http'
    }
  }
};
