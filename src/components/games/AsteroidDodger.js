import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const GameContainer = styled.div`
  background: linear-gradient(to bottom, #0B0B2B, #1B1B4B);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Canvas = styled.canvas`
  border: 2px solid #00ffff;
  border-radius: 10px;
  background: #000033;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
`;

const StartScreen = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  border: 1px solid #00ffff;
  color: white;
  width: 400px;
`;

const Button = styled.button`
  background: linear-gradient(45deg, #00ffff, #0066ff);
  border: none;
  padding: 1rem 2rem;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.2rem;
  margin-top: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const Controls = styled.div`
  margin-top: 1rem;
  text-align: left;
  padding: 1rem;
  background: rgba(0, 0, 255, 0.1);
  border-radius: 5px;
`;

const Score = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #00ffff;
  font-size: 1.5rem;
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 5px;
`;

const GameOverScreen = styled(StartScreen)``;

class Rocket {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 40;
    this.height = 60;
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.speed = 5;
    this.angle = 0;
    
    // Load rocket image
    this.image = new Image();
    this.image.src = '/interaction/rocket.png';
    
    // Set initial state
    this.isMovingUp = false;
    this.isMovingDown = false;
    this.isMovingLeft = false;
    this.isMovingRight = false;
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.angle);
    
    // Draw rocket body
    this.ctx.beginPath();
    this.ctx.moveTo(0, -this.height/2);
    this.ctx.lineTo(this.width/4, this.height/2);
    this.ctx.lineTo(-this.width/4, this.height/2);
    this.ctx.closePath();
    this.ctx.fillStyle = '#ff4444';
    this.ctx.fill();
    
    // Draw rocket fins
    this.ctx.beginPath();
    this.ctx.moveTo(this.width/4, this.height/3);
    this.ctx.lineTo(this.width/2, this.height/2);
    this.ctx.lineTo(this.width/4, this.height/2);
    this.ctx.moveTo(-this.width/4, this.height/3);
    this.ctx.lineTo(-this.width/2, this.height/2);
    this.ctx.lineTo(-this.width/4, this.height/2);
    this.ctx.fillStyle = '#cc0000';
    this.ctx.fill();
    
    // Draw rocket window
    this.ctx.beginPath();
    this.ctx.arc(0, -this.height/6, this.width/6, 0, Math.PI * 2);
    this.ctx.fillStyle = '#00ffff';
    this.ctx.fill();
    
    this.ctx.restore();
  }

  update() {
    if (this.isMovingUp) this.y -= this.speed;
    if (this.isMovingDown) this.y += this.speed;
    if (this.isMovingLeft) this.x -= this.speed;
    if (this.isMovingRight) this.x += this.speed;

    // Keep rocket within canvas bounds
    this.x = Math.max(this.width/2, Math.min(this.canvas.width - this.width/2, this.x));
    this.y = Math.max(this.height/2, Math.min(this.canvas.height - this.height/2, this.y));
  }

  handleKeyDown(e) {
    switch(e.key) {
      case 'ArrowUp':
        this.isMovingUp = true;
        this.angle = -Math.PI/2;
        break;
      case 'ArrowDown':
        this.isMovingDown = true;
        this.angle = Math.PI/2;
        break;
      case 'ArrowLeft':
        this.isMovingLeft = true;
        this.angle = Math.PI;
        break;
      case 'ArrowRight':
        this.isMovingRight = true;
        this.angle = 0;
        break;
    }
  }

  handleKeyUp(e) {
    switch(e.key) {
      case 'ArrowUp':
        this.isMovingUp = false;
        break;
      case 'ArrowDown':
        this.isMovingDown = false;
        break;
      case 'ArrowLeft':
        this.isMovingLeft = false;
        break;
      case 'ArrowRight':
        this.isMovingRight = false;
        break;
    }
  }
}

class Asteroid {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.radius = Math.random() * 20 + 20;
    this.points = Math.floor(Math.random() * 4) + 8;
    this.vertices = [];
    this.angle = 0;
    this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    this.speed = Math.random() * 2 + 2;

    // Generate random position outside canvas
    const side = Math.floor(Math.random() * 4);
    switch(side) {
      case 0: // top
        this.x = Math.random() * canvas.width;
        this.y = -this.radius;
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 + 1;
        break;
      case 1: // right
        this.x = canvas.width + this.radius;
        this.y = Math.random() * canvas.height;
        this.dx = -(Math.random() * 2 + 1);
        this.dy = Math.random() * 2 - 1;
        break;
      case 2: // bottom
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + this.radius;
        this.dx = Math.random() * 2 - 1;
        this.dy = -(Math.random() * 2 + 1);
        break;
      case 3: // left
        this.x = -this.radius;
        this.y = Math.random() * canvas.height;
        this.dx = Math.random() * 2 + 1;
        this.dy = Math.random() * 2 - 1;
        break;
    }

    this.generateVertices();
  }

  generateVertices() {
    this.vertices = [];
    for (let i = 0; i < this.points; i++) {
      const angle = (i / this.points) * Math.PI * 2;
      const variance = Math.random() * (this.radius * 0.2);
      const r = this.radius + variance;
      this.vertices.push({
        x: Math.cos(angle) * r,
        y: Math.sin(angle) * r
      });
    }
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(this.angle);
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
    for (let i = 1; i < this.vertices.length; i++) {
      this.ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
    }
    this.ctx.closePath();
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  update() {
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
    this.angle += this.rotationSpeed;
  }

  isOffscreen() {
    return (
      this.x < -this.radius * 2 ||
      this.x > this.canvas.width + this.radius * 2 ||
      this.y < -this.radius * 2 ||
      this.y > this.canvas.height + this.radius * 2
    );
  }

  checkCollision(rocket) {
    const dx = this.x - rocket.x;
    const dy = this.y - rocket.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + Math.min(rocket.width, rocket.height) / 2;
  }
}

const AsteroidDodger = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    parseInt(localStorage.getItem('asteroidDodgerHighScore')) || 0
  );

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;

    const rocket = new Rocket(canvas);
    let asteroids = [];
    let animationId;
    let lastAsteroidTime = 0;
    
    const handleKeyDown = (e) => rocket.handleKeyDown(e);
    const handleKeyUp = (e) => rocket.handleKeyUp(e);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = (timestamp) => {
      // Clear canvas
      ctx.fillStyle = '#000033';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 100; i++) {
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          1,
          1
        );
      }

      // Update and draw rocket
      rocket.update();
      rocket.draw();

      // Create new asteroid every 2 seconds
      if (timestamp - lastAsteroidTime > 2000) {
        asteroids.push(new Asteroid(canvas));
        lastAsteroidTime = timestamp;
      }

      // Update and draw asteroids
      asteroids = asteroids.filter(asteroid => {
        asteroid.update();
        asteroid.draw();

        // Check collision
        if (asteroid.checkCollision(rocket)) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('asteroidDodgerHighScore', score);
          }
          return false;
        }

        return !asteroid.isOffscreen();
      });

      // Update score
      setScore(prev => prev + 1);

      if (!gameOver) {
        animationId = requestAnimationFrame(gameLoop);
      }
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
  };

  return (
    <GameContainer>
      <Canvas ref={canvasRef} />
      {!gameStarted && (
        <StartScreen>
          <h1>Asteroid Dodger</h1>
          <Controls>
            <h3>How to Play:</h3>
            <p>Use Arrow Keys to move the rocket</p>
            <p>↑ Up</p>
            <p>↓ Down</p>
            <p>← Left</p>
            <p>→ Right</p>
            <p>Avoid colliding with asteroids!</p>
          </Controls>
          <Button onClick={startGame}>Start Game</Button>
        </StartScreen>
      )}
      {gameStarted && !gameOver && <Score>Score: {score}</Score>}
      {gameOver && (
        <GameOverScreen>
          <h2>Game Over!</h2>
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
          <Button onClick={restartGame}>Play Again</Button>
        </GameOverScreen>
      )}
    </GameContainer>
  );
};

export default AsteroidDodger;
