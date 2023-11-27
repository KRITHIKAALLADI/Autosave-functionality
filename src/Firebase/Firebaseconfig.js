import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, setDoc, deleteDoc} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDV1CeBhcuoVbQ3zTYqSQHTdfqDTDwLl7Q",
    authDomain: "autosave-42bc4.firebaseapp.com",
           projectId: "autosave-42bc4",
               storageBucket: "autosave-42bc4.appspot.com",
           messagingSenderId: "771386845834",
          appId: "1:771386845834:web:2b670a49c30715f06edb73",
               measurementId: "G-VTZ9WQGTNB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore, collection, addDoc, getDoc, getDocs, doc, setDoc, deleteDoc};
