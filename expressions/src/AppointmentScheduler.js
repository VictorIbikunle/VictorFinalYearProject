import React, { useState } from 'react';
import './AppointmentScheduler.css';

const AppointmentForm = ({ selectedDateTime, onSubmit }) => {
  const [patientName, setPatientName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ patientName, selectedDateTime });
    setPatientName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Patient Name:
        <input
          type="text"
          value={patientName}
          onChange={(e) => setPatientName(e.target.value)}
          required
        />
      </label>
      <button type="submit">Book Appointment with Notification</button>
    </form>
  );
};

const AppointmentsList = ({ appointments, onDelete }) => {
  return (
    <div className="appointments-list-container">
      <h2>All Appointments</h2>
      <ul className="appointments-list">
        {appointments.map((appointment, index) => (
          <li key={index}>
            <p>Patient Name: {appointment.patientName}</p>
            <p>Time: {appointment.time.toLocaleString()}</p>
            <button onClick={() => onDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const setReminders = (appointmentTime) => {
  const now = new Date();
  const timeDifference = appointmentTime - now;

  const fifteenMinutesBefore = timeDifference - 15 * 60 * 1000; // 15 minutes in milliseconds
  const fiveMinutesBefore = timeDifference - 5 * 60 * 1000; // 5 minutes in milliseconds

  if (fifteenMinutesBefore > 0) {
    setTimeout(() => {
      alert(`Appointment in 15 minutes: ${appointmentTime.toLocaleString()}`);
    }, fifteenMinutesBefore);
  }

  if (fiveMinutesBefore > 0) {
    setTimeout(() => {
      alert(`Appointment in 5 minutes: ${appointmentTime.toLocaleString()}`);
    }, fiveMinutesBefore);
  }
};

const AppointmentScheduler = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const handleDateTimeChange = (date, time) => {
    const selectedDateTime = new Date(`${date}T${time}`);
    setSelectedDateTime(selectedDateTime);
    setIsFormVisible(true);
  };

  const handleFormSubmit = ({ patientName, selectedDateTime }) => {
    // Handle the form submission logic (e.g., send data to the server)
    console.log(
      `Booking appointment for ${patientName} on ${selectedDateTime.toLocaleString()}`
    );

    // Trigger a notification
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Appointment Confirmed', {
            body: `Appointment with ${patientName} on ${selectedDateTime.toLocaleString()} is confirmed!`,
          });
        }
      });
    }

    // Set reminders for the new appointment
    setReminders(selectedDateTime);

    // Save the appointment
    const newAppointment = { patientName, time: selectedDateTime };
    setAppointments([...appointments, newAppointment]);

    setIsFormVisible(false);
    setSelectedDateTime(null); // Clear date and time
  };

  const handleDeleteAppointment = (index) => {
    const updatedAppointments = [...appointments];
    updatedAppointments.splice(index, 1);
    setAppointments(updatedAppointments);
  };

  return (
    <div>
      <h1>Appointment Scheduler</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h3>Select Date and Time:</h3>
          <input
            type="date"
            onChange={(e) =>
              handleDateTimeChange(e.target.value, selectedDateTime)
            }
          />
          <input
            type="time"
            onChange={(e) =>
              handleDateTimeChange(
                selectedDateTime.toDateString(),
                new Date(`1970-01-01T${e.target.value}:00`)
              )
            }
          />
        </div>
        {isFormVisible && (
          <div>
            <h3>Add Patient:</h3>
            <AppointmentForm
              selectedDateTime={selectedDateTime}
              onSubmit={handleFormSubmit}
            />
          </div>
        )}
      </div>
      <AppointmentsList
        appointments={appointments}
        onDelete={handleDeleteAppointment}
      />
    </div>
  );
};

export default AppointmentScheduler;
