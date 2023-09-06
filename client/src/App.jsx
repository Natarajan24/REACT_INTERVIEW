import React, { useState } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    selectedSchema: '',
  });
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [segmentName, setSegmentName] = useState();
  const [schema, setSchema] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' },
  ]);

  const handleChange = (e) => {
    const foundItem = availableSchemas.find(item => item.label === e.target.value);
    schema.push(foundItem);
    setInputValue({ ...inputValue, [e.target.name]: e.target.value });

  };

  const handleSchema = (e, index) => {
    const updatedSelectedSchemas = [...selectedSchemas];
    updatedSelectedSchemas[index] = e.target.value;
    setSelectedSchemas(updatedSelectedSchemas);
  };


  const handleClickToOpen = () => {
    setPopUpOpen(true);
  };


  const handleCancel = () => {
    setPopUpOpen(false);
    setInputValue({ ...inputValue, selectedSchema: '' });
    setSelectedSchemas([])
  };

  const handleSubmit = () => {
    const data = {
      segment_name: segmentName,
      schema: schema.map((selectedSchema) => ({
        [selectedSchema.value]: selectedSchema.label,
      })),
    };

    if (data.segment_name === undefined || data.schema.length === 0) {
      alert("Please fill in the segment name field and Add schema");
      return null
    } else {
      axios
        .post('https://webhook.site/c0a07569-4f17-4090-aa28-007e36c1a5ff', data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };


  const addSchemaToBlueBox = () => {
    if (inputValue.selectedSchema) {
      setSelectedSchemas([...selectedSchemas, inputValue.selectedSchema]);
      setAvailableSchemas(
        availableSchemas.filter(
          (schema) => schema.value !== inputValue.selectedSchema
        )
      );
      setInputValue({ ...inputValue, selectedSchema: '' });
    }
  };

  const addSchema = () => {
    const availableSchemasForNewDropdown = availableSchemas.filter(
      (schema) => !selectedSchemas.includes(schema.label)
    );
    return (
      <select
        name="selectedSchema"
        value={inputValue.selectedSchema}
        onChange={(e) => handleChange(e)}
        className="custom-select"
      >
        <option value="">Add schema to segment</option>
        {availableSchemasForNewDropdown.map((schema) => (
          <option key={schema.value} value={schema.label}>
            {schema.label}
          </option>
        ))}
      </select>
    );
  };

  const addSchemaDropdown = () => {
    const availableSchemasForNewDropdown = availableSchemas.filter(
      (schema) => !selectedSchemas.includes(schema.label)
    );
    return selectedSchemas.map((schema, index) => {
      return (
        <div key={index} className="responsive-dropdown" style={{ width: "280px" }}>
          <select
            value={schema}
            onChange={(e) => handleSchema(e, index)}
            className="custom-select"
          >
            <option value={schema}>{schema}</option>
            {availableSchemasForNewDropdown.map((schema) => (
              <option key={schema.label} value={schema.label}>
                {schema.label}
              </option>
            ))}
          </select>
        </div>
      )
    })
  };


  return (
    <>
      <div className="page">
        <header className="header">View Audience</header>
        <button onClick={handleClickToOpen} className="save-button">Save Segment</button>
        <br />
        {popUpOpen ? (
          <div className="popup">
            <div className="popup-heading">Saving Segment</div>
            <label>Enter the Name of the Segment</label>
            <input
              type="text"
              placeholder="Name of the segment"
              onChange={(e) => setSegmentName(e.target.value)}
            />
            <p>To save your segment, you need to add the schemas to build the query</p>
            <div className={selectedSchemas.length > 0 ? "bordered-dropdown" : ""}>{addSchemaDropdown()}</div>
            <br />
            {addSchema()}
            <br />
            <div className="add-schema-link" onClick={addSchemaToBlueBox}>
              <a href="#addSchema">+ Add new schema</a>
            </div>

            <div className="footer-buttons">
              <button onClick={handleSubmit}>Save the Segment</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        ) : null}
      </div>

    </>
  );
};

export default App;


