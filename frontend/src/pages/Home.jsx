import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import Accordion from "react-bootstrap/Accordion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import a1 from "./images/a1.png";
import a2 from "./images/a2.jpeg";
import b1 from "./images/b1.jpeg";
import b2 from "./images/b1.jpg";
import o1 from "./images/o1.jpg";
import o2 from "./images/o2.jpg";
import c1 from "./images/c1.jpeg";
import c2 from "./images/c2.jpg";
const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({ city: "", location: "", type: "" });

  const locationsByCity = {
    Vijayawada: ["Labbipet", "Patamata", "Gurunanak Colony"],
    Hyderabad: ["L.B.Nagar", "Jubilee Hills", "Banjara Hills"],
    Vizag: ["Bheemili", "Seethamadhara", "Rushikonda"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "city" ? { location: "" } : {}),
    }));
  };

  const handleSearch = () => {
    if (searchData.city && searchData.location && searchData.type) {
      navigate(`/event-spaces?city=${searchData.city}&location=${searchData.location}&type=${searchData.type}`);
    }
  };

  return (
    <div className="container mt-4 home-container">
      {/* Carousel Section */}
      <Carousel className="mb-4">
        {[
          { img: b2, title: "Banquet Hall" },
          { img: a1, title: "Auditorium" },
          { img: o1, title: "Open Garden" },
          { img: c1, title: "Conference Room" },
        ].map((item, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100 carousel-img" src={item.img} alt={item.title} />
            <Carousel.Caption>
              <h3 className="carousel-title">{item.title}</h3>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Search Section */}
      <div className="search-box p-4">
        <div className="row">
          {["city", "location", "type"].map((field, index) => (
            <div className="col-md-4" key={index}>
              <select name={field} className="form-control" onChange={handleChange} value={searchData[field]}>
                <option value="">{`Select ${field.charAt(0).toUpperCase() + field.slice(1)}`}</option>
                {(field === "city"
                  ? Object.keys(locationsByCity)
                  : field === "location" && searchData.city
                  ? locationsByCity[searchData.city]
                  : ["Banquet Hall", "Auditorium", "Open Garden", "Conference Room"]
                ).map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <button className="btn btn-custom" onClick={handleSearch} disabled={!searchData.city || !searchData.location || !searchData.type}>Search Event Spaces</button>
        </div>
      </div>

      {/* Event Space Types */}
      <h2 className="mt-5 text-center">Popular Event Spaces</h2>
      <div className="row">
        {[
          { title: "Banquet Hall", img:b1, desc: "Perfect for weddings and celebrations." },
          { title: "Auditorium", img: a2, desc: "Ideal for conferences and performances." },
          { title: "Open Garden", img: o2, desc: "Outdoor space for parties and receptions." },
          { title: "Conference Room", img: c2, desc: "Great for business meetings and seminars." },
        ].map((space, index) => (
          <div className="col-md-3 mt-3" key={index}>
            <div className="card event-card">
              <img src={space.img} className="card-img-top" alt={space.title} />
              <div className="card-body text-center">
                <h5 className="card-title">{space.title}</h5>
                <p className="card-text">{space.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <h2 className="mt-5 text-center">Frequently Asked Questions</h2>
      <Accordion className="faq-section mt-3">
        {[
          { q: "How do I book an event space?", a: "Select your city, location, and type, then click 'Search Event Spaces' to proceed with booking." },
          { q: "What facilities are included?", a: "Event spaces include AC, parking, catering, and seating arrangements. Check the details before booking." },
          { q: "Can I cancel my booking?", a: "Yes, you can cancel via 'My Bookings'. Cancellation policies may apply." },
        ].map((faq, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>{faq.q}</Accordion.Header>
            <Accordion.Body>{faq.a}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default Home;
