# MercuReal Pong

A modern, interactive implementation of the classic Pong arcade game built with vanilla HTML5, CSS3, and JavaScript. This project features real-time gameplay, intelligent computer AI, responsive design, and stunning visual effects.

## 🎮 Features

### Core Gameplay
- **Two-Player Mode**: Player vs Computer with adaptive AI opponent
- **Collision Detection**: Precise paddle and wall collision physics
- **Dynamic Ball Physics**: Ball acceleration and spin mechanics based on paddle impact
- **Real-Time Scoring**: Live scoreboard tracking both players' scores
- **Winning Condition**: First to 5 points wins the match

### Player Controls
- **Mouse Control**: Move the left paddle by tracking mouse Y position
- **Keyboard Support**: Arrow Keys (↑↓) for alternative paddle movement
- **Game Controls**: SPACE key to start/pause gameplay

### Visual Design
- **Modern Aesthetics**: Vibrant neon gradient color scheme (cyan, lime green, magenta)
- **Glowing Effects**: Shadow blur and glow animations on game elements
- **Responsive Layout**: Optimized for desktop and tablet displays
- **Professional UI**: Clean scoreboard with game instructions and status indicators

## 🚀 Technologies Used

- **HTML5**: Canvas API for rendering graphics
- **CSS3**: Gradient backgrounds, flexbox layouts, and visual effects
- **JavaScript (ES6)**: Game loop, physics engine, and AI implementation

## 📋 How to Play

1. Open `index.html` in your web browser
2. Press **SPACE** to start the game
3. Move your paddle using:
   - **Mouse**: Move your cursor up/down
   - **Keyboard**: Press Arrow Keys (↑↓)
4. Hit the ball past your opponent's paddle to score
5. First player to reach 5 points wins
6. Press **SPACE** to pause/resume at any time

## 🤖 Computer AI

The computer opponent features intelligent ball-tracking capabilities:
- Real-time ball position prediction
- Adaptive paddle movement with reaction delay
- Balanced difficulty suitable for casual and experienced players
- Bounded movement to maintain fair gameplay

## ⚽ Game Physics

### Ball Mechanics
- Constant velocity movement with directional tracking
- Elastic collision with paddles and walls
- Speed increase on each paddle contact (max speed capped)
- Spin effect based on paddle contact position
- Automatic ball reset after scoring

### Paddle Dynamics
- Smooth movement with velocity control
- Boundary detection to prevent paddle escape
- Responsive input handling for both mouse and keyboard

## 📊 Game Statistics

- **Canvas Resolution**: 800 x 400 pixels
- **Paddle Dimensions**: 10 x 80 pixels
- **Ball Radius**: 6 pixels
- **Max Ball Speed**: 8 pixels per frame
- **Initial Ball Speed**: 5 pixels per frame
- **Paddle Speed**: 6 pixels per frame

## 🎨 Color Palette

| Element | Color | Hex Code |
|---------|-------|----------|
| Background | Purple Gradient | #667eea - #764ba2 |
| Paddles | Lime Green | #00ff88 |
| Paddle Border | Cyan | #00d4ff |
| Ball | Magenta | #ff00ff |
| Ball Border | Cyan | #00ffff |
| Text | Yellow | #ffff00 |

## 🔧 Installation & Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Ahmadns7/Pong-game.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Pong-game
   ```

3. Open `index.html` in your preferred web browser

No build process, dependencies, or server required - the game runs entirely in the browser!

## 📁 Project Structure

```
Pong-game/
├── index.html       # Main HTML file with canvas setup
├── style.css        # Styling and visual effects
├── script.js        # Game logic and physics engine
└── README.md        # Project documentation
```

## 🎯 Future Enhancements

Potential features for future versions:
- Difficulty level selection
- Two-player local multiplayer mode
- Sound effects and background music
- Power-ups and special effects
- High score persistence (LocalStorage)
- Mobile touch controls
- Theme customization options

## 📝 License

This project is open source and available under the MIT License. Feel free to use, modify, and distribute as needed.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature suggestions.

## 👤 Author

**Ahmad NS** - Created as a demonstration of vanilla JavaScript game development principles.

---

Enjoy playing **MercuReal Pong**! 🏓✨
