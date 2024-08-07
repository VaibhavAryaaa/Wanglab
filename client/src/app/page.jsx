"use client";
import React from "react";

function MainComponent() {
  const [reservations, setReservations] = React.useState([]);
  const [form, setForm] = React.useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    multipleEquipments: [],
    otherEquipment: "",
  });
  const [error, setError] = React.useState("");
  
const port = "https://wanglab-1.onrender.com/"
  React.useEffect(() => {
    // Fetch reservations when component mounts
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch(port);
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        console.error("Failed to fetch reservations");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleInputChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleMultipleEquipmentsChange = (e) => 
    {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setForm({ ...form, multipleEquipments: value });
  };

  const checkOverlap = () => {
    const newStartTime = new Date(`${form.date}T${form.startTime}`);
    const newEndTime = new Date(`${form.date}T${form.endTime}`);
    return reservations.some((reservation) => {
      if (form.date !== reservation.date) return false;
      if (!form.multipleEquipments.some((equip) => reservation.equipment.includes(equip))) return false;
      const existingStartTime = new Date(`${reservation.date}T${reservation.startTime}`);
      const existingEndTime = new Date(`${reservation.date}T${reservation.endTime}`);
      return newStartTime < existingEndTime && newEndTime > existingStartTime;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name && form.date && form.startTime && form.endTime && form.multipleEquipments.length) {
      if (checkOverlap()) {
        setError("The selected equipment is already reserved for the specified time period.");
        return;
      }
      const equipmentDetail = form.multipleEquipments.includes("Others")
        ? form.otherEquipment
        : form.multipleEquipments.join(", ");

      const newReservation = {
        name: form.name,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        equipment: equipmentDetail,
      };

      try {
        const response = await fetch(port, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReservation),
        });

        if (response.ok) {
          const savedReservation = await response.json();
          setReservations([...reservations, savedReservation]);

          // Clear the form after successful submission
          setForm({
            name: "",
            date: "",
            startTime: "",
            endTime: "",
            multipleEquipments: [],
            otherEquipment: "",
          });
          setError(""); // Clear any previous errors
        } else {
          console.error("Failed to save reservation");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-center font-roboto text-blue-500">
          University of California, Irvine
        </h1>
        <h1 className="text-4xl font-bold text-center font-roboto border-4 border-blue-500 p-2 mt-2">
          WANG RESEARCH GROUP
        </h1>
        <h2 className="text-2xl font-semibold text-center mt-2 font-roboto">
          Lab Advisor: Dr. Xizheng Wang
        </h2>
        <p className="text-center font-roboto mt-1">
          Assistant Professor,
          <a href="https://engineering.uci.edu/dept/mae" className="text-blue-600">
            {" "}
            Mechanical and Aerospace Engineering
          </a>
          <br />
          Location: Office 3221 Engineering Gateway, Lab 2105 Engineering Gateway
        </p>
      </header>

      <section className="mb-6">
        <h3 className="text-xl font-semibold font-roboto">Lab Details</h3>
        <p className="font-roboto">
          Our research interests range across various areas of{" "}
          <strong>Sustainable Manufacturing</strong>, including sustainable
          electrified ultrahigh-temperature (up to 3000 K) synthesis and
          manufacturing of functional nano/bulk materials, ultrahigh-temperature
          additive manufacturing, as well as wood nanotechnology. Our goal is to
          design and synthesize novel functional materials for applications in
          energy, catalysis, and sustainability, and to achieve a fundamental
          understanding of the high-temperature process using in-situ and
          in-operando characterizations.
        </p>
      </section>

      <section>
        <h3 className="text-xl font-semibold font-roboto mb-4">
          Reserve Lab Room and Equipment
        </h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-roboto">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border rounded"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-roboto">Pick a Date</label>
            <input
              type="date"
              name="date"
              className="w-full p-2 border rounded"
              value={form.date}
              min="2024-01-01"
              max="2025-12-31"
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-roboto">Start Time</label>
            <input
              type="time"
              name="startTime"
              className="w-full p-2 border rounded"
              value={form.startTime}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-roboto">End Time</label>
            <input
              type="time"
              name="endTime"
              className="w-full p-2 border rounded"
              value={form.endTime}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="block font-roboto">Select Equipment</label>
            <select
              name="multipleEquipments"
              className="w-full p-2 border rounded"
              value={form.multipleEquipments}
              onChange={handleMultipleEquipmentsChange}
              multiple
            >
              <option value="High-Speed Camera">A - High-Speed Camera</option>
              <option value="Glove Box">B - Glove Box</option>
              <option value="Chamber">C - Chamber</option>
              <option value="1st Power Supply">D - 1st Power Supply</option>
              <option value="2nd Power Supply">E - 2nd Power Supply</option>
              <option value="Compressing Machine">
                F - Compressing Machine
              </option>
              <option value="Others">G - Others</option>
            </select>
          </div>
          {form.multipleEquipments.includes("Others") && (
            <div>
              <label className="block font-roboto">
                Specify Other Equipment
              </label>
              <input
                type="text"
                name="otherEquipment"
                className="w-full p-2 border rounded"
                placeholder="Specify equipment"
                value={form.otherEquipment}
                onChange={handleInputChange}
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded font-roboto"
          >
            Submit
          </button>
        </form>
        {error &&
        (
          <div className="mt-4 text-red-600 font-roboto">
            {error}
          </div>
        )}
        <div className="mt-6">
          <h3 className="text-xl font-semibold font-roboto mb-4">
            Reserved Slots
          </h3>
          <div className="bg-white p-4 rounded shadow">
            {reservations.length === 0 ? (
              <p className="font-roboto">No slots reserved yet.</p>
            ) : (
              reservations.map((res, index) => 
                (
                <div key={index} className="mb-4">
                  <p className="font-roboto">
                   <strong>{res.name}</strong>  reserved {res.equipment} on <strong>{res.date}</strong>  from {res.startTime} to {res.endTime}
                  </p>
                  <hr className="mt-2" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainComponent;