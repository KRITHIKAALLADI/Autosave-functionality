import React, { useState, useEffect } from 'react';
import { firestore, addDoc, collection, getDocs, doc, setDoc, deleteDoc} from '../../src/Firebase/Firebaseconfig';
import { v4 as uuidv4 } from 'uuid';
import './Form.css';

const Form = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Gender: '',
    Height: '',
    Address: '',
    PhoneNumber: '',
    Password: '',
  });

  const [timer, setTimer] = useState(null);
  const [submittedData, setSubmittedData] = useState([]);
  const [userId, setUserId] = useState('');
  const [editingData, setEditingData] = useState(null); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    saveFormDataToSessionStorage(updatedFormData);
  };
  const saveToTemporaryCollection = async() => {
    const user = getUserId();
    if (user) {
      const tempCollection = collection(firestore, 'temporaryData');
      const  userDocRef = doc(tempCollection, user); // Reference to the specific document with userId
      await setDoc( userDocRef, formData) // Set the data to that specific document
          console.log('Data saved to temporary collection');  
    }
  };

  const saveFormDataToSessionStorage = (data) => {
    sessionStorage.setItem('formData', JSON.stringify(data));
  };

  useEffect(() => {
    const savedFormData = sessionStorage.getItem('formData');
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);
  
  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
  };

  const getUserId = () => {
    let user = sessionStorage.getItem('userId');
    if (!user) {
      user = generateUserId();
      sessionStorage.setItem('userId', user);
      setUserId(user);
    }
    return user;
  };

  const generateUserId = () => {
    const userId = uuidv4(); // Using uuid to generate a unique user ID
    return userId;
  };

  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      clearTimer();
      const autoSaveTimer = setTimeout(() => {
        saveToTemporaryCollection();
      }, 5000); // Adjust the delay as needed (e.g., auto-save after 2 seconds of inactivity)
      setTimer(autoSaveTimer);
    }
    return () => {
      clearTimer(); // Clear timer on component unmount
    };
  }, [formData]);

  const deleteTemporaryRecord = async () => {
    const user = getUserId();
    if (user) {
      const tempCollection = collection(firestore, 'temporaryData');
      const userDocRef = doc(tempCollection, user);
      await deleteDoc(userDocRef);
      console.log('Temporary record deleted');
    }
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCollectionRef = collection(firestore, 'finalData');
    const user = getUserId();
    if (user) {
      if (editingData) {
        const userDocRef = doc(finalCollectionRef, user);
        setDoc(userDocRef, formData)
          .then(() => {
            console.log('Data updated and saved to final collection');
            setFormData({
              Name: '',
              Email: '',
              Gender: '',
              Height: '',
              Address: '',
              PhoneNumber: '',
              Password: '',
            });
            setEditingData(null);
            sessionStorage.removeItem('formData');
          })
          .catch((error) => {
            console.error('Error updating document: ', error);
          });
      } else {
        const userDocRef = doc(finalCollectionRef, user);
        setDoc(userDocRef, formData)
          .then(() => {
            console.log('Data submitted and saved to final collection');
            setFormData({
              Name: '',
              Email: '',
              Gender: '',
              Height: '',
              Address: '',
              PhoneNumber: '',
              Password: '',
            });
            deleteTemporaryRecord();
            sessionStorage.removeItem('formData');
          })
          .catch((error) => {
            console.error('Error adding document: ', error);
          });
      }
    } 
  };

  const handleEdit = (data) => {
    setEditingData(data);
    setFormData({
      Name: data.Name || '',
      Email: data.Email || '',
      Gender: data.Gender || '',
      Height: data.Height || '',
      Address: data.Address || '',
      PhoneNumber: data.PhoneNumber || '',
      Password: data.Password || '',
    });
  };
  
  const handleViewData = async () => {
    try {
      const finalCollectionRef = collection(firestore, 'finalData');
      const querySnapshot = await getDocs(finalCollectionRef);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setSubmittedData(data);
    } catch (error) {
      console.error('Error getting documents: ', error);
    }
  };
 return (
    <>
    
    <form onSubmit={handleSubmit}>
     <lable>
       Name:
       <input type="text" name="Name" value={formData.Name} onChange={handleInputChange} />
     </lable>
     <label>
       Email:
       <input type="email" name="Email" value={formData.Email} onChange={handleInputChange} />
     </label>
     <label>
       Gender:
       <select
         name="Gender"
         value={formData.Gender}
         onChange={handleInputChange}
         className="form-input"
       >
         <option value="">Select Gender</option>
         <option value="male">Male</option>
         <option value="female">Female</option>
         <option value="other">Other</option>
       </select>
     </label>
     <label>
       Height:
       <input
         type="text"
         name="Height"
         value={formData.Height}
         onChange={handleInputChange}
         className="form-input" />
     </label>
     <label>
       Address:
       <textarea
         name="Address"
         value={formData.Address}
         onChange={handleInputChange}
         className="form-input"
       ></textarea>
     </label>
     <label>
       PhoneNumber:
       <input
         type="text"
         name="PhoneNumber"
         value={formData.PhoneNumber}
         onChange={handleInputChange}
         className="form-input" />
     </label>
     <label>
       Password:
       <input
         type="password"
         name="Password"
         value={formData.Password}
         onChange={handleInputChange}
         className="form-input" />
     </label>
     <button type="submit">Submit</button>
   </form>
   <button className="view-data-btn" onClick={handleViewData}>View Submitted Data</button>
   <table>
       <thead>
         <tr>
           <th>Name</th>
           <th>Email</th>
           <th>Gender</th>
           <th>Height</th>
           <th>Address</th>
           <th>PhoneNumber</th>
           <th>Password</th>
         </tr>
       </thead>
       <tbody>
         {submittedData.map((data, index) => (
           <tr key={index}>
             <td>{data.Name}</td>
             <td>{data.Email}</td>
             <td>{data.Gender}</td>
             <td>{data.Height}</td>
             <td>{data.Address}</td>
             <td>{data.PhoneNumber}</td>
             <td>{data.Password}</td>
             <td>
                <button onClick={() => handleEdit(data)}>Edit</button>
              </td>
           </tr>
         ))}
       </tbody>
     </table> 
   </>
  );
};

export default Form;


