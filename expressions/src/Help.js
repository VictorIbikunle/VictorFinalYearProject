import React, { useState } from "react";
import "./Help.css";
import axios from "axios";

function Help() {
    const [formData, setFormData] = useState({
        patientName: "",
        notes: "",
        reference: "",
    });

    const [confirmationMessage, setConfirmationMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = async () => {
        try {
            // Send data to the Flask backend
            const response = await axios.post("http://localhost:5000/save_data", formData);
            setConfirmationMessage(response.data.message);

            // Clear the form data after saving
            setFormData({
                patientName: "",
                notes: "",
                reference: "",
            });
        } catch (error) {
            console.error("Error saving data:", error);
            setConfirmationMessage("Error saving information. Please try again.");
        }
    };

    return (
        <div className="patient-form">
            <h1>Welcome to the reports page</h1>
            <h2>This is where you will write the report about the video and save it to the system.</h2>

            <div className="form-group">
                <label>Patient Name:</label>
                <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group">
                <label>Notes:</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group">
                <label>Reference:</label>
                <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                />
            </div>

            <button onClick={handleSave}>Save</button>

            {confirmationMessage && <p>{confirmationMessage}</p>}
        </div>
    );
}

export default Help;

