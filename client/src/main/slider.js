import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './slider.css';

const TestimonialsSlider = () => {
  const { t } = useTranslation();
  const testimonials = t('testimonials', { returnObjects: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex + 4 >= testimonials.length ? 0 : prevIndex + 4
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [testimonials]);

  return (
    <div className="testimonial-slider">
      <div className="testimonial-container">
        {testimonials.slice(currentIndex, currentIndex + 4).map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="testimonial-image"
            />
            <div className="testimonial-content">
              <p className="testimonial-text">{testimonial.text}</p>
              <h3 className="testimonial-name">{testimonial.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSlider;
