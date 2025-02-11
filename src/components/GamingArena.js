import React from 'react';
import { Link } from 'react-router-dom';
import './InteractionZone.css';

const GamingArena = () => {
  const gameCards = [
    {
      title: 'Constellation Connect',
      description: 'Link stars to form constellations in this pattern-matching game. Learn about star patterns and celestial navigation.',
      image: '/interaction/Constellation.jpg',
      path: '/interaction/constellation-connect'
    },
    {
      title: 'Asteroid Dodger',
      description: 'Navigate through asteroid fields in this exciting space adventure. Test your reflexes and learn about space hazards.',
      image: '/interaction/asteroid_dodge.jpg',
      path: '/interaction/asteroid-dodger'
    },
    {
      title: 'Time Traveller',
      description: 'Journey through different space eras in this educational game. Experience the evolution of our understanding of space.',
      image: '/interaction/time-traveler.jpg',
      path: '/interaction/time-traveller'
    },
    {
      title: 'Celestial Challenge',
      description: 'Compete in various space-themed mini-games and puzzles. Put your cosmic knowledge to the test.',
      image: '/interaction/celestial_challenge.jpg',
      path: '/interaction/celestial-challenge'
    }
  ];

  return (
    <div className="interaction-zone">
      <div className="interaction-zone-header">
        <h1>Gaming Arena</h1>
        <p>
          Challenge yourself with our collection of space-themed games.
          Learn while you play and compete with other space enthusiasts.
        </p>
      </div>
      
      <div className="interaction-cards-container">
        {gameCards.map((card, index) => (
          <Link 
            to={card.path}
            key={index} 
            className="interaction-card"
            style={{
              animationDelay: `${index * 0.2}s`
            }}
          >
            <div className="interaction-card-image">
              <img src={card.image} alt={card.title} />
            </div>
            <div className="interaction-card-content">
              <h2>{card.title}</h2>
              <p>{card.description}</p>
              <div className="interaction-card-arrow">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GamingArena;
