
import React, { useState, useEffect } from 'react';
import "./Home.css";

const Patient = () => {
  const [patientData, setPatientData] = useState({
    name: '',
    dob: '',
    phoneNumber: '',
  });

  const [patients, setPatients] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientData({ ...patientData, [name]: value });
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:5000/save_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient: patientData,
          goal: {},
          emotion: {},
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        console.log(result.user_message);

        setUserMessage(result.user_message);
        setPatientData({
          name: '',
          dob: '',
          phoneNumber: '',
        });
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting patient data:", error.message);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/get_all_patients');
      if (response.ok) {
        const data = await response.json();
        setPatients(data.patients);
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching patients:', error.message);
    }
  };

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div>
      <h1>Patient Information</h1>
      <form onSubmit={handlePatientSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={patientData.name} onChange={handleInputChange} />
        </label>
        <label>
          Date of Birth:
          <input type="date" name="dob" value={patientData.dob} onChange={handleInputChange} />
        </label>
        <label>
          Phone Number:
          <input type="tel" name="phoneNumber" value={patientData.phoneNumber} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit Patient Data</button>
      </form>
      {userMessage && (
        <div>
          <p>{userMessage}</p>
          <button onClick={() => setUserMessage('')}>Clear Message</button>
        </div>
      )}

      {/* Button to fetch and display all patients */}
      <button onClick={fetchPatients}>See All Patients</button>

      {/* Display the list of patients */}
      <div>
        <h2>All Patients</h2>
        <ul>
          {patients.map((patient) => (
            <li key={patient._id}>{patient.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Patient;



