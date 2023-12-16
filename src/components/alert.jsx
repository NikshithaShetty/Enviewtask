import React, { useState, useEffect } from "react";
import { Input, Select, DatePicker, Button, List, Col, Row } from "antd";


const { Option } = Select;

const alertsData = [
  {
    id: "6049dbd2-45bc-4e34-9ea2-c82ced0279f1",
    alert_type: "Unsafe driving",
    vehicle_id: "cc70a7e5-8397-4914-bbbb-4d6bb521ec67",
    driver_friendly_name: "Ramesh",
    vehicle_friendly_name: "KA12A3456",
    timestamp: "2023-12-01T04:25:45.424Z",
  },
  {
    id: "5149dbd2-45bc-4e34-9ea2-c82ced0279f1",
    alert_type: "Distracted driver",
    vehicle_id: "dd70a7e5-8397-4914-bbbb-4d6bb521ec67",
    driver_friendly_name: "Suresh",
    vehicle_friendly_name: "MH12A3456",
    timestamp: "2024-01-01T04:24:45.424Z",
  },
];

const vehiclesData = [
  {
    friendly_name: "KA12A3456",
    id: "dd70a7e5-8397-4914-bbbb-4d6bb521ec67",
  },
  {
    friendly_name: "MH12A3456",
    id: "cc70a7e5-8397-4914-bbbb-4d6bb521ec67",
  },
];

const App = () => {
  const [alerts, setAlerts] = useState(alertsData);
  const [searchText, setSearchText] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [falseAlarm, setFalseAlarm] = useState([]);
  const [isttime, setIsttime] = useState()

  const handleInputChange = (e) => {
    const { value } = e.target;
    // Check if the input contains only alphabetic characters or an empty string
    if (/^[A-Za-z\s]*$/.test(value) || value === '') {
      setSearchText(value);
    }
  };


  useEffect(() => {

    const filteredAlerts = alertsData.filter((alert) => {

      // Convert the provided timestamp to IST
      const date = new Date(alert.timestamp);
      const ISTTime = date.toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata', // Indian Standard Time
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
      setIsttime(ISTTime);

      // Filter by free text search
      const textFields = [
        alert.alert_type.toLowerCase(),
        alert.driver_friendly_name.toLowerCase()]
      const textMatch = textFields.some((field) =>
        field.includes(searchText.toLowerCase())
      );

      // Filter by vehicle number
      const vehicleMatch = alert.vehicle_friendly_name.toLowerCase().includes(selectedVehicle.toLowerCase());



      // Filter by date range
      const timestamp = new Date(alert.timestamp).getTime();
      const dateMatch =
        dateRange.length === 0 ||
        (timestamp >= dateRange[0].startOf("day").valueOf() &&
          timestamp <= dateRange[1].endOf("day").valueOf());
     
     return textMatch && vehicleMatch && dateMatch;
    });

    setAlerts(filteredAlerts);
  }, [searchText, selectedVehicle, dateRange]);



  const markAsFalseAlarm = (alertId) => {
    // Logic to mark an alert as false alarm
    setFalseAlarm((prevFalseAlarm) =>
      prevFalseAlarm.includes(alertId)
        ? prevFalseAlarm.filter((id) => id !== alertId)
        : [...prevFalseAlarm, alertId]
    );
    console.log(`Marked alert ${alertId} as false alarm.`);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "rgb(211, 211, 211)" }}>
      <Row gutter={{ xs: 24, sm: 24, md: 16, lg: 32 }}>
        <Col className="gutter-row">
          <Input type="text"
            placeholder="Enter text to search"
            value={searchText}
            onChange={(e) => handleInputChange(e)}
          />
        </Col>
        <Col className="gutter-row" >
          <Select
            placeholder="Select vehicle number"
            style={{ width: 200, marginRight: 8 }}
            value={selectedVehicle}
            onChange={(value) => {
              const selectedVehicleName =
                vehiclesData.find((vehicle) => vehicle.id === value)
                  ?.friendly_name || "";
              setSelectedVehicle(selectedVehicleName);
            }}
          >
            {vehiclesData.map((vehicle) => (
              <Option key={vehicle.id} value={vehicle.id}>
                {vehicle.friendly_name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col className="gutter-row" >
          <DatePicker.RangePicker
            style={{ marginRight: "10px" }}
            onChange={(value) => setDateRange(value)}
            allowClear={false}
          />
        </Col>

      </Row>
      <div style={{ padding: "20px", backgroundColor: "white", margin: "20px 0", borderRadius: "5px" }}>
        <h1 style={{ borderBottom: "1px solid black" }}>Alert </h1>
        <Row gutter={{ xs: 32, sm: 32, md: 32, lg: 32 }} style={{ width: '100%', display: "block" }}>

          <List
            dataSource={alerts}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <Col className="gutter-row">
                  <h3>{item.alert_type}</h3>

                  <p>Driver: {item.driver_friendly_name}/{item.vehicle_friendly_name}</p>
                </Col>
                <Col className="gutter-row">
                  <p>{isttime ? isttime : ""}</p>
                </Col>
                <Col className="gutter-row">
                  <Button style={{ backgroundColor: falseAlarm.includes(item.id) ? 'red' : 'white', }}
                    onClick={() => markAsFalseAlarm(item.id)}>
                    Mark as False Alarm
                  </Button>
                </Col>
              </List.Item>
            )}
          />
        </Row>
      </div>
    </div>
  );
};

export default App;
