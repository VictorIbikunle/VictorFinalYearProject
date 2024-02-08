
import React, { useState, useEffect } from 'react';
import './Information.css';

const emotionsData = [
  {
    emotion: 'Happy',
    image: process.env.PUBLIC_URL + '/Images/happy.jpg',
    description: 'It\'s always good to be happy, let\'s see how we can maintain that!',
    moreInfo: 'The road to happiness isn’t always easy, nor does it really have one final destination.Joy exists on a spectrum. And thanks to work, life and relationship problems ― not to mentionyou know, an extremely distressing global pandemic ― it can be easy to fall on the lower end of the spectrum more frequently.'
    ,
  },
  {
    emotion: 'Angry',
    image: process.env.PUBLIC_URL + '/Images/anger.jpg',
    description: 'Anger can be difficult to control sometimes...',
    moreInfo: 'A good way to calm anger and prevent any harm is to use anger management exercises.These techniques work by first calming you down and then helping you move forward in a positive way. ',
  },
  {
    emotion: 'Fearful',
    image: process.env.PUBLIC_URL + '/Images/fear.jpg',
    description: 'We need to tackle fear with bravery!',
    moreInfo: 'Examining thoughts that are causing the fear can be a first step to addressing and overcoming it. The process may take time, and fear may persist, but support from family and friends can often be helpful. 1.Understand what is causing their fear, 2.Put fear into perspective, 3.Set realistic expectations for the future',
  },
  {
    emotion: 'Sad',
    image: process.env.PUBLIC_URL + '/Images/sad.jpg',
    description: 'Let\'s see how we can cheer you up!',
    moreInfo: 'Through acknowledgement, people can begin to understand the root of their sadness, the underlying contributors, and what makes it worse.',
  },
];

const Information = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    let counter = 0;

    const interval = setInterval(() => {
      if (!showPopup) {
        setActiveCard((prev) => (prev % emotionsData.length) + 1);
      }
      counter++;
    }, 4000);

    return () => clearInterval(interval);
  }, [showPopup]);

  const handleCardClick = (index) => {
    setActiveCard(index);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="information-page">
      <h1>Welcome to the Information Page</h1>
      <div className="slider">
        <div className="slides" style={{ transform: `translateX(${-100 * (activeCard - 1)}%)` }}>
          {emotionsData.map((emotion, index) => (
            <div className={`slide`} key={index}>
              <img src={emotion.image} alt={emotion.emotion} />
              <div className="card-details">
                <h2>{emotion.emotion}</h2>
                <p>{emotion.description}</p>
                <button onClick={() => handleCardClick(index + 1)}>View More</button>
              </div>
            </div>
          ))}
        </div>
        <div className="navigation-manual">
          {emotionsData.map((_, index) => (
            <label
              htmlFor={`radio${index + 1}`}
              className={`manual-btn ${activeCard === index + 1 ? 'checked' : ''}`}
              key={index}
            ></label>
          ))}
        </div>
      </div>

      {emotionsData.map((emotion, index) => (
        <div className={`paragraph ${index === activeCard - 1 ? 'active' : ''}`} key={index}>
          <h2>If the patient is feeling {emotion.emotion.toLowerCase()}</h2>
          <p>{emotion.description}</p>
        </div>
      ))}

      {showPopup && (
        <div className="popup" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>{emotionsData[activeCard - 1].emotion}</h2>
            <p>{emotionsData[activeCard - 1].moreInfo}</p>
            <span className="close" onClick={closePopup}>X</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Information;
