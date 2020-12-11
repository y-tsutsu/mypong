'use strict';

(() => {
    function rand(min, max) {
        return Math.random() * (max - min) + min;
    }

    class Ball {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
            this.x = rand(60, 500);
            this.y = 60;
            this.r = 12;
            this.vx = rand(6, 12) * (Math.random() < 0.5 ? 1 : -1);
            this.vy = rand(6, 12) * (Math.random() < 0.5 ? 1 : -1);
            this.isMissed = false;
        }

        getX() {
            return this.x;
        }

        getY() {
            return this.y;
        }

        getR() {
            return this.r;
        }

        getMissedStatus() {
            return this.isMissed;
        }

        bounce() {
            this.vy *= -1;
        }

        reposition(paddleTop) {
            this.y = paddleTop - this.r;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.y - this.r > this.canvas.height) {
                this.isMissed = true;
            }

            if (this.x - this.r < 0 || this.x + this.r > this.canvas.width) {
                this.vx *= -1
            }
            if (this.y - this.r < 0) {
                this.vy *= -1
            }
        }

        draw() {
            this.ctx.beginPath();
            this.ctx.fillStyle = '#fdfdfd';
            this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    class Paddle {
        constructor(canvas, onBounce) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
            this.onBounce = onBounce;
            this.w = 120;
            this.h = 32;
            this.x = (this.canvas.width - this.w) / 2;
            this.y = this.canvas.height - 64;
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = this.x + rect.left + (this.w / 2);
            this.addHandler();
        }

        addHandler() {
            document.addEventListener('mousemove', e => {
                this.mouseX = e.clientX;
            })
        }

        update(ball) {
            const rect = this.canvas.getBoundingClientRect();
            this.x = this.mouseX - rect.left - (this.w / 2);
            if (this.x < 0) {
                this.x = 0;
            }
            if (this.x + this.w > this.canvas.width) {
                this.x = this.canvas.width - this.w;
            }

            const ballBottom = ball.getY() + ball.getR();
            const ballTop = ball.getY() - ball.getR();
            const ballCenter = ball.getX();
            const paddleTop = this.y;
            const paddleBottom = this.y + this.h;
            const paddleLeft = this.x;
            const paddleRight = this.x + this.w;
            if (ballBottom > paddleTop && ballTop < paddleBottom &&
                ballCenter > paddleLeft && ballCenter < paddleRight) {
                ball.bounce();
                ball.reposition(paddleTop);
                this.onBounce();
            }
        }

        draw() {
            this.ctx.fillStyle = '#a051a2';
            this.ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }

    class Game {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
            this.isGameOver = false;
            this.score = 0;
            this.ball = new Ball(this.canvas);
            this.paddle = new Paddle(this.canvas, () => {
                this.score++;
            });
            this.loop();
        }

        loop() {
            if (this.isGameOver) {
                return;
            }

            this.update();
            this.draw();
            requestAnimationFrame(() => this.loop());
        }

        update() {
            this.ball.update();
            this.paddle.update(this.ball);
            if (this.ball.getMissedStatus()) {
                this.isGameOver = true;
            }
        }

        draw() {
            if (this.isGameOver) {
                this.drawGameOver();
                return;
            }

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ball.draw();
            this.paddle.draw();
            this.drawScore();
        }

        drawGameOver() {
            this.ctx.font = '54px "Arial Black"';
            this.ctx.fillStyle = 'tomato';
            this.ctx.fillText('GAME OVER', 150, 300);
        }

        drawScore() {
            this.ctx.font = '40px Arial';
            this.ctx.fillStyle = '#7cc8e9';
            this.ctx.fillText(this.score, 20, 50);
        }
    }

    const canvas = document.querySelector('canvas');
    if (typeof canvas.getContext === 'undefined') {
        return;
    }

    new Game(canvas);
})();
