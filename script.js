// Wait for DOM to load before initializing
document.addEventListener('DOMContentLoaded', function() {
    // Canvas setup
    const canvas = document.getElementById('gameCanvas');
    
    // Check if canvas exists
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // Detect if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Resize canvas for mobile devices
    function resizeCanvasForMobile() {
        const container = canvas.parentElement;
        const maxWidth = window.innerWidth * 0.95;
        const maxHeight = window.innerHeight * 0.5;
        
        let width = 800;
        let height = 400;
        
        const aspectRatio = width / height;
        
        if (maxWidth < width) {
            width = maxWidth;
            height = width / aspectRatio;
        }
        
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }
        
        canvas.width = Math.floor(width);
        canvas.height = Math.floor(height);
    }
    
    if (isMobile) {
        resizeCanvasForMobile();
        window.addEventListener('resize', resizeCanvasForMobile);
        window.addEventListener('orientationchange', () => {
            setTimeout(resizeCanvasForMobile, 100);
        });
    }

    // Game variables
    let gameRunning = false;
    let playerScore = 0;
    let computerScore = 0;

    // Paddle properties (adaptive to canvas size)
    const paddleWidth = canvas.width * 0.015;
    const paddleHeight = canvas.height * 0.25;
    const paddleSpeed = canvas.height * 0.03;

    // Player paddle
    const player = {
        x: canvas.width * 0.01,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        dy: 0
    };

    // Computer paddle
    const computer = {
        x: canvas.width - paddleWidth - canvas.width * 0.01,
        y: canvas.height / 2 - paddleHeight / 2,
        width: paddleWidth,
        height: paddleHeight,
        dy: 0
    };

    // Ball properties
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: canvas.height * 0.02,
        dx: canvas.width * 0.008,
        dy: canvas.height * 0.01,
        speed: canvas.width * 0.008
    };

    // Input handling
    const keys = {};
    let mouseY = canvas.height / 2;
    
    // Touch variables
    let touchY = canvas.height / 2;
    let isTouching = false;
    let lastTouchTime = 0;

    // Desktop keyboard input
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;

        // Space to start/pause
        if (e.key === ' ') {
            e.preventDefault();
            gameRunning = !gameRunning;
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // Mouse input for desktop
    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseY = e.clientY - rect.top;
    });

    // Canvas click to start
    canvas.addEventListener('click', (e) => {
        if (!isMobile) {
            e.preventDefault();
            gameRunning = !gameRunning;
        }
    });

    // Touch input for mobile
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isTouching = true;
        lastTouchTime = Date.now();
        handleTouchMove(e);
        
        // Double tap to start/pause on mobile
        if (Date.now() - lastTouchTime < 300) {
            gameRunning = !gameRunning;
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        handleTouchMove(e);
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        isTouching = false;
    }, { passive: false });

    function handleTouchMove(e) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        touchY = touch.clientY - rect.top;
        
        // Ensure touch is within canvas bounds
        if (touchY < 0) touchY = 0;
        if (touchY > canvas.height) touchY = canvas.height;
    }

    // Mobile control buttons
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const mobileControls = document.getElementById('mobileControls');

    if (isMobile && mobileControls) {
        mobileControls.classList.add('show');
        
        // Up button
        if (upBtn) {
            upBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                keys['ArrowUp'] = true;
            }, { passive: false });
            upBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                keys['ArrowUp'] = false;
            }, { passive: false });
        }
        
        // Down button
        if (downBtn) {
            downBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                keys['ArrowDown'] = true;
            }, { passive: false });
            downBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                keys['ArrowDown'] = false;
            }, { passive: false });
        }
    }

    // Update game state
    function update() {
        if (!gameRunning) return;

        // Player paddle movement
        if (isTouching) {
            // Touch input
            if (touchY - paddleHeight / 2 < canvas.height - paddleHeight && touchY - paddleHeight / 2 > 0) {
                player.y = touchY - paddleHeight / 2;
            }
        } else {
            // Mouse input
            if (mouseY - paddleHeight / 2 < canvas.height - paddleHeight && mouseY - paddleHeight / 2 > 0) {
                player.y = mouseY - paddleHeight / 2;
            }
        }

        if (keys['ArrowUp'] && player.y > 0) {
            player.y -= paddleSpeed;
        }
        if (keys['ArrowDown'] && player.y < canvas.height - paddleHeight) {
            player.y += paddleSpeed;
        }

        // Ball movement
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with top and bottom walls
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ball.dy *= -1;
            // Keep ball in bounds
            ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
        }

        // Ball collision with player paddle
        if (
            ball.x - ball.radius < player.x + player.width &&
            ball.y > player.y &&
            ball.y < player.y + player.height
        ) {
            ball.dx = Math.abs(ball.dx) * 1.05; // Increase speed slightly
            ball.x = player.x + player.width + ball.radius;

            // Add spin based on where ball hits paddle
            const hitPos = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
            ball.dy += hitPos * 2;
        }

        // Ball collision with computer paddle
        if (
            ball.x + ball.radius > computer.x &&
            ball.y > computer.y &&
            ball.y < computer.y + computer.height
        ) {
            ball.dx = -Math.abs(ball.dx) * 1.05; // Increase speed slightly
            ball.x = computer.x - ball.radius;

            // Add spin based on where ball hits paddle
            const hitPos = (ball.y - (computer.y + computer.height / 2)) / (computer.height / 2);
            ball.dy += hitPos * 2;
        }

        // Ball out of bounds (scoring)
        if (ball.x - ball.radius < 0) {
            computerScore++;
            const computerScoreEl = document.getElementById('computerScore');
            if (computerScoreEl) computerScoreEl.textContent = computerScore;
            resetBall();
            checkGameWin();
        }
        if (ball.x + ball.radius > canvas.width) {
            playerScore++;
            const playerScoreEl = document.getElementById('playerScore');
            if (playerScoreEl) playerScoreEl.textContent = playerScore;
            resetBall();
            checkGameWin();
        }

        // Computer AI
        const computerCenter = computer.y + computer.height / 2;
        const ballCenter = ball.y;
        const aiDifficulty = 0.08;

        if (computerCenter < ballCenter - 35) {
            computer.y += paddleSpeed * 0.9;
        } else if (computerCenter > ballCenter + 35) {
            computer.y -= paddleSpeed * 0.9;
        }

        // Keep computer paddle in bounds
        if (computer.y < 0) computer.y = 0;
        if (computer.y + computer.height > canvas.height) {
            computer.y = canvas.height - computer.height;
        }

        // Limit ball speed
        const maxSpeed = canvas.width * 0.02;
        if (Math.abs(ball.dx) > maxSpeed) ball.dx = (ball.dx / Math.abs(ball.dx)) * maxSpeed;
        if (Math.abs(ball.dy) > maxSpeed) ball.dy = (ball.dy / Math.abs(ball.dy)) * maxSpeed;
    }

    // Reset ball to center
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = (Math.random() > 0.5 ? 1 : -1) * canvas.width * 0.008;
        ball.dy = (Math.random() - 0.5) * canvas.height * 0.01;
        gameRunning = false;
    }

    // Check if someone won
    function checkGameWin() {
        if (playerScore >= 5 || computerScore >= 5) {
            const winner = playerScore >= 5 ? 'PLAYER' : 'COMPUTER';
            alert(`${winner} WINS! Final Score - Player: ${playerScore}, Computer: ${computerScore}`);
            resetGame();
        }
    }

    // Reset entire game
    function resetGame() {
        playerScore = 0;
        computerScore = 0;
        const playerScoreEl = document.getElementById('playerScore');
        const computerScoreEl = document.getElementById('computerScore');
        if (playerScoreEl) playerScoreEl.textContent = playerScore;
        if (computerScoreEl) computerScoreEl.textContent = computerScore;
        resetBall();
        gameRunning = false;
    }

    // Draw functions
    function drawPaddle(paddle) {
        ctx.fillStyle = '#00ff88';
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.shadowColor = 'rgba(0, 255, 136, 0.8)';
        ctx.shadowBlur = 10;
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.shadowBlur = 0;
    }

    function drawBall() {
        ctx.fillStyle = '#ff00ff';
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = 'rgba(255, 0, 255, 0.8)';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    function drawNet() {
        ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function drawGameState() {
        if (!gameRunning) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffff00';
            ctx.font = `bold ${canvas.width * 0.04}px Arial`;
            ctx.textAlign = 'center';
            const startText = isMobile ? 'Tap to Start' : 'Press SPACE to Start';
            ctx.fillText(startText, canvas.width / 2, canvas.height / 2);
        }
    }

    // Main render loop
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw game elements
        drawNet();
        drawPaddle(player);
        drawPaddle(computer);
        drawBall();
        drawGameState();
    }

    // Game loop
    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    // Start the game
    gameLoop();

    // Prevent default touch behaviors
    document.addEventListener('touchmove', function(e) {
        if (e.target === canvas) {
            e.preventDefault();
        }
    }, { passive: false });
});
