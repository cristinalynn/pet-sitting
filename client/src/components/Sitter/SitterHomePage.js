import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';  // Use a carousel library like react-responsive-carousel
import "react-responsive-carousel/lib/styles/carousel.min.css";  // Import the styles for the carousel
 

function SitterHomePage() {
  const [services, setServices] = useState([
    { name: "Dog Walking", price: 30, duration: "30 minutes" },
    { name: "Boarding", price: 50, duration: "1 day" },
    { name: "Drop ins", price: 15, duration: "15 minutes" },
    { name: "Day care", price: 40, duration: "8 hours" },
  ]);

  const [availability, setAvailability] = useState("Full-Time");
  const [carouselImages, setCarouselImages] = useState([
    "../Images/dogs.jpg", 
    "../Images/cats.jpg", 
    "../Images/birds.jpg", 
    "../Images/lizard.jpg",
    "../Images/chickens.jpg"
  ]);  // Example image URLs

  // Optionally fetch services and availability from the backend if dynamic
  useEffect(() => {
    // Fetch availability and services from API if needed
    // fetch('/api/availability') or '/api/services'
  }, []);

  return (
    <div className="sitter-home-page">
      <section className="about-me">
        <h2>About Me</h2>
        <p>Hello! My name is [sitter.name], and I am a passionate pet sitter. I have over 5 years of experience providing care for pets, from dog walking to day care and boarding services. I love animals, and my mission is to ensure your pet feels safe, loved, and happy while in my care!</p>
      </section>

      <section className="sitter-availability">
        <h3>Availability</h3>
        <p>I am currently available: <strong>{availability}</strong></p>
      </section>

      <section className="services-table">
        <h3>Services Offered</h3>
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Price ($)</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index}>
                <td>{service.name}</td>
                <td>{service.price.toFixed(2)}</td>
                <td>{service.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="pet-carousel">
        <h3>Meet Some of the Pets I Care For!</h3>
        <Carousel showThumbs={false} autoPlay infiniteLoop>
          {carouselImages.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Pet ${index + 1}`} />
            </div>
          ))}
        </Carousel>
      </section>
    </div>
  );
}

export default SitterHomePage;
