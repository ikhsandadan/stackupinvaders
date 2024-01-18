import { useEffect, useRef } from 'react';
import ship1 from "../images/ship1.png";
import ship2 from "../images/ship2.png";
import ship3 from "../images/ship3.png";

const Canvas = ({ShipName, setHp, setScores, Ship, alien1, alien2, alien3, boss }) => {
    const ref = useRef();

    useEffect(() => {
        try {
            if (document.readyState === 'complete') {
                const canvas = ref.current;
                const context = canvas.getContext("2d");
                canvas.width = 1024;
                canvas.height = 576;
                context.fillStyle = "white";
                context.strokeStyle = "white";
                context.lineWidth = 5;
    
                class Laser {
                    constructor(game) {
                        this.game = game;
                        this.x = 0;
                        this.y = 0;
                        this.height = this.game.height - 50;
                    }
    
                    render(context) {
                        this.x = this.game.player.x + this.game.player.width / 2 - this.width / 2;
    
                        this.game.player.energy -= this.damage;
    
                        context.save();
                        context.fillStyle = "gold";
                        context.fillRect(this.x, this.y, this.width, this.height);
                        context.fillStyle = "white";
                        context.fillRect(this.x + this.width * 0.2, this.y, this.width * 0.6, this.height);
                        context.restore();
    
                        this.game.waves.forEach(wave => {
                            wave.enemies.forEach(enemy => {
                                if (this.game.checkCollision(enemy, this)) {
                                    enemy.hit(this.damage);
                                    createParticles({
                                        object: enemy,
                                        fades: true
                                    });
                                }
                            });
                        });
    
                        this.game.bossArray.forEach(boss => {
                            if (this.game.checkCollision(boss, this)) {
                                boss.hit(this.damage);
                                createParticles({
                                    object: boss,
                                    color: "yellow",
                                    fades: true
                                });
                            }
                        });
                    }
                }
    
                class SmallLaser extends Laser {
                    constructor(game) {
                        super(game);
                        this.width = 5;
                        this.damage = 0.2;
                    }
    
                    render(context) {
                        if (this.game.player.energy > 1 && !this.game.player.cooldown) {
                            super.render(context);
                        }
                    }
                }
    
                class BigLaser extends Laser {
                    constructor(game) {
                        super(game);
                        this.width = 14;
                        this.damage = 0.5;
                    }
    
                    render(context) {
                        if (this.game.player.energy > 1 && !this.game.player.cooldown) {
                            super.render(context);
                        }
                    }
                }

                class SuperBigLaser extends Laser {
                    constructor(game) {
                        super(game);
                        this.width = 20;
                        this.damage = 0.8;
                    }
    
                    render(context) {
                        if (this.game.player.energy > 1 && !this.game.player.cooldown) {
                            super.render(context);
                        }
                    }
                }
    
                class Player {
                    constructor(game) {
                        this.game = game;
                        this.width = 70;
                        this.height = 70;
                        this.x = this.game.width / 2 - this.width / 2;
                        this.y = this.game.height - this.height;
                        this.speed = 5;
                        this.lives = 3;
                        this.image = new Image();
                        this.image.src = Ship;
                        this.smallLaser = new SmallLaser(this.game);
                        this.bigLaser = new BigLaser(this.game);
                        this.superBigLaser = new SuperBigLaser(this.game);
                        this.energy = 25;
                        this.maxEnergy = 50;
                        this.cooldown = false;
                    }
    
    
                    draw(context) {
                        if (this.game.keys.indexOf("Control") > -1 && ShipName === "Blue Space Ship") {
                            this.smallLaser.render(context);
                        } else if (this.game.keys.indexOf("Control") > -1 && ShipName === "Red Space Ship") {
                            this.bigLaser.render(context);
                        } else if (this.game.keys.indexOf("Control") > -1 && ShipName === "Green Space Ship") {
                            this.superBigLaser.render(context);
                        }
    
                        context.drawImage(this.image, this.x, this.y, this.width, this.height);
                    }
    
                    update() {
                        // Energy
                        if (this.energy < this.maxEnergy) {
                            if (ShipName === "Red Space Ship") {
                                this.energy += 0.10;
                                this.maxEnergy = 75;
                            } else if (ShipName === "Green Space Ship") {
                                this.energy += 0.15;
                                this.maxEnergy = 100;
                            } else {
                                this.energy += 0.05;
                            }
                        }
    
                        if (this.energy < 1) {
                            this.cooldown = true;
                        } else if (this.energy > this.maxEnergy * 0.2) {
                            this.cooldown = false;
                        }
    
                        // Movement
                        if (this.game.keys.indexOf("ArrowLeft") > -1) {
                            this.x -= this.speed;
                        }
    
                        if (this.game.keys.indexOf("ArrowRight") > -1) {
                            this.x += this.speed;
                        }
    
                        // Boundaries
                        if (this.x < 0) {
                            this.x = 0;
                        } else if (this.x > this.game.width - this.width) {
                            this.x = this.game.width - this.width;
                        }
                    }
    
                    shoot() {
                        const projectile = this.game.getProjectile();
                        if (projectile) {
                            projectile.start(this.x + this.width * 0.575, this.y);
                        }
                    }
    
                    restart() {
                        this.x = this.game.width / 2 - this.width / 2;
                        this.y = this.game.height - this.height;
                        this.lives = 3;
                    }
                }
    
                class Particle {
                    constructor({position, velocity, radius, color, fades}) {
                        this.position = position;
                        this.velocity = velocity;
        
                        this.radius = radius;
                        this.color = color;
                        this.opacity = 1;
                        this.fades = fades;
                    };
        
                    draw() {
                        context.save();
                        context.globalAlpha = this.opacity;
                        context.beginPath();
                        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
                        context.fillStyle = this.color;
                        context.fill();
                        context.closePath();
                        context.restore();
                    };
        
                    update() {
                        this.draw();
                        this.position.x += this.velocity.x;
                        this.position.y += this.velocity.y;
        
                        if (this.fades)
                        this.opacity -= 0.01;
                    };
                };
    
                class Projectile {
                    constructor() {
                        this.width = 10;
                        this.height = 10;
                        this.x = 0;
                        this.y = 0;
                        this.speed = 10;
                        this.free = true;
                        this.radius = 4;
                    }
    
                    draw(context) {
                        if (!this.free) {
                            context.save();
                            context.beginPath();
                            context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                            context.fillStyle = "yellow";
                            context.fill();
                            context.closePath();
                            context.restore();
                        }
                    }
    
                    update() {
                        if (!this.free) {
                            this.y -= this.speed;
    
                            if (this.y < -this.height) {
                                this.reset();
                            }
                        }
                    }
    
                    start(x, y) {
                        this.x = x - this.width / 2;
                        this.y = y;
                        this.free = false;
                    }
    
                    reset() {
                        this.free = true;
                    }
                }
    
                class EnemyProjectile {
                    constructor({position, velocity}) {
                        this.position = position;
                        this.velocity = velocity;
        
                        this.width = 3;
                        this.height = 10;
                    };
        
                    draw() {
                        context.save();
                        context.fillStyle = "red";
                        context.fillRect(this.position.x, this.position.y, this.width, this.height);
                        context.restore();
                    };
        
                    update() {
                        this.draw();
                        this.position.x += this.velocity.x;
                        this.position.y += this.velocity.y;
                    };
                };
    
                class BossProjectile {
                    constructor({position, velocity}) {
                        this.position = position;
                        this.velocity = velocity;
        
                        this.width = 8;
                        this.height = 10;
                    };
        
                    draw() {
                        context.save();
                        context.fillStyle = "red";
                        context.fillRect(this.position.x, this.position.y, this.width, this.height);
                        context.restore();
                    };
        
                    update() {
                        this.draw();
                        this.position.x += this.velocity.x;
                        this.position.y += this.velocity.y;
                    };
                };
    
                class Enemy {
                    constructor(game, positionX, positionY) {
                        this.game = game;
                        this.width = this.game.enemySize;
                        this.height = this.game.enemySize;
                        this.x = 0;
                        this.y = 0;
                        this.positionX = positionX;
                        this.positionY = positionY;
                        this.markedForDeletion = false;
                    }
    
                    draw(context) {
                        context.drawImage(this.image, this.x, this.y, this.width, this.height);
                    }
    
                    update(x, y) {
                        this.x = x + this.positionX;
                        this.y = y + this.positionY;
    
                        // Check collision enemies - projectiles
                        this.game.projectilesPool.forEach(projectile => {
                            if (!projectile.free && this.game.checkCollision(this, projectile)) {
                                this.hit(1);
                                projectile.reset();
    
                                createParticles({
                                    object: this,
                                    fades: true
                                });
                            }
                        });
    
                        if (this.lives < 1) {
                            this.markedForDeletion = true;
                            this.game.score += this.maxLives * 100;
                        }
    
                        // Check collision enemy bullets - player
                        this.game.enemyProjectiles.forEach((enemyProjectile, index) => {
                            if (
                                enemyProjectile.position.y + enemyProjectile.height >= 
                                this.game.player.y && enemyProjectile.position.x + 
                                enemyProjectile.width >= this.game.player.x && 
                                enemyProjectile.position.x <= this.game.player.x + this.game.player.width
                                ) {
                                delete this.game.enemyProjectiles[index];
                                this.game.player.lives -= 1;
        
                                createParticles({
                                    object: this.game.player,
                                    color: "white",
                                    fades: true
                                });
    
                                if (this.game.player.lives < 1) {
                                    this.gameOver = true;
                                }
                            }
                        });
    
                        // Check collison enemies - player
                        if (this.game.checkCollision(this, this.game.player)) {
                            this.markedForDeletion = true;
                            this.game.player.lives -= 1;
    
                            createParticles({
                                object: this.game.player,
                                color: "white",
                                fades: true
                            });
    
                            if (this.game.player.lives < 1) {
                                this.gameOver = true;
                            }
                        }
                    }
    
                    shoot(enemyProjectiles) {
                        enemyProjectiles.push(new EnemyProjectile({
                            position: {
                                x: this.x + this.width / 2,
                                y: this.y + this.height
                            },
                            velocity: {
                                x: 0,
                                y: 5
                            }
                        }));
                    };
    
                    hit(damage) {
                        this.lives -= damage;
                    }
                }
    
                class Alien1 extends Enemy {
                    constructor(game, positionX, positionY) {
                        super(game, positionX, positionY);
                        this.image = new Image();
                        this.image.src = alien1;
                        this.lives = 1;
                        this.maxLives = this.lives;
                    }
                }
    
                class Alien2 extends Enemy {
                    constructor(game, positionX, positionY) {
                        super(game, positionX, positionY);
                        this.image = new Image();
                        this.image.src = alien2;
                        this.lives = 2;
                        this.maxLives = this.lives;
                    }
                }
    
                class Alien3 extends Enemy {
                    constructor(game, positionX, positionY) {
                        super(game, positionX, positionY);
                        this.image = new Image();
                        this.image.src = alien3;
                        this.lives = 3;
                        this.maxLives = this.lives;
                    }
                }
    
                class Boss {
                    constructor(game, bossLives) {
                        this.game = game;
                        this.width = 150;
                        this.height = 150;
                        this.x = this.game.width / 2 - this.width / 2;
                        this.y = -this.height;
                        this.speedX = Math.random() < 0.5 ? - 1 : 1;
                        this.speedY = 0;
                        this.lives = bossLives;
                        this.maxLives = this.lives;
                        this.markedForDeletion = false;
                        this.image = new Image();
                        this.image.src = boss;
                    }
    
                    draw(context) {
                        context.drawImage(this.image, this.x, this.y, this.width, this.height);
                        if (this.lives >= 1) {
                            context.save();
                            context.textAlign = "center";
                            context.font = "20px Arial";
                            context.shadowOffsetX = 3;
                            context.shadowOffsety = 3;
                            context.shadowColor = "black";
                            context.fillText(Math.floor(this.lives), this.x + this.width / 2, this.y + 40);
                            context.restore();
                        }
                    }
    
                    update() {
                        this.speedY = 0;
                        if (this.y < 0) {
                            this.y += 4;
                        }
    
                        if (this.x < 0 || this.x > this.game.width - this.width && this.lives >= 1) {
                            this.speedX *= -1;
                            this.speedY = this.height / 2;
                        }
    
                        this.x += this.speedX;
                        this.y += this.speedY;
    
                        // Collision detection boss - projectile
                        this.game.projectilesPool.forEach(projectile => {
                            if (this.game.checkCollision(this, projectile) && !projectile.free && this.lives >= 1 && this.y >= 0) {
                                this.hit(1);
                                projectile.reset();
                                createParticles({
                                    object: this,
                                    color: "yellow",
                                    fades: true
                                });
                            }
                        });
    
                        // Check collision boss bullets - player
                        this.game.bossProjectiles.forEach((bossProjectile, index) => {
                            if (
                                bossProjectile.position.y + bossProjectile.height >= 
                                this.game.player.y && bossProjectile.position.x + 
                                bossProjectile.width >= this.game.player.x && 
                                bossProjectile.position.x <= this.game.player.x + this.game.player.width
                                ) {
                                delete this.game.bossProjectiles[index];
                                this.game.player.lives -= 1;
        
                                createParticles({
                                    object: this.game.player,
                                    color: "white",
                                    fades: true
                                });
    
                                if (this.game.player.lives < 1) {
                                    this.gameOver = true;
                                }
                            }
                        });
    
                        // Collision detection boss - player
                        if (this.game.checkCollision(this, this.game.player) && this.lives >= 1) {
                            this.game.player.lives = 0;
    
                            createParticles({
                                object: this.game.player,
                                color: "white",
                                fades: true
                            });
    
                            this.gameOver = true;
                        }
    
                        // Boss destroyed
                        if (this.lives < 1) {
                            this.markedForDeletion = true;
                            this.game.score += this.maxLives * 100;
    
                            this.game.bossLives += 5;
    
                            if (!this.gameOver) {
                                this.game.newWave();
                            }
                        }
                    }
    
                    shoot(bossProjectiles) {
                        bossProjectiles.push(new BossProjectile({
                            position: {
                                x: this.x + this.width / 2,
                                y: this.y + this.height
                            },
                            velocity: {
                                x: 0,
                                y: 5
                            }
                        }));
                    };
    
                    hit(damage) {
                        this.lives -= damage;
                    }
                }
    
                class Wave {
                    constructor(game) {
                        this.game = game;
                        this.width = this.game.columns * this.game.enemySize;
                        this.height = this.game.rows * this.game.enemySize;;
                        this.x = this.game.width / 2 - this.width / 2;
                        this.y = -this.height;
                        this.speedX = Math.random() < 0.5 ? -1 : 1;
                        this.speedY = 0;
                        this.enemies = [];
                        this.nextWaveTrigger = false;
                        this.markedForDeletion = false;
                        this.create();
                    }
    
                    render(context) {
                        if (this.y < 0) {
                            this.y += 5;
                        }
    
                        this.speedY = 0;
                        this.x += this.speedX;
    
                        if (this.x < 0 || this.x > this.game.width - this.width) {
                            this.speedX *= -1;
                            this.speedY = this.game.enemySize;
                        }
    
                        this.x += this.speedX;
                        this.y += this.speedY;
                        this.enemies.forEach(enemy => {
                            enemy.update(this.x, this.y);
                            enemy.draw(context);
    
                            // Each enemy has a chance to shoot a bullet
                            if (Math.random() < 0.002) {
                                enemy.shoot(this.game.enemyProjectiles);
                            }
                        });
    
                        this.enemies = this.enemies.filter(object => !object.markedForDeletion);
    
                        if (this.enemies.length <= 0) {
                            this.markedForDeletion = true;
                        }
                    }
    
                    create() {
                        for (let y = 0; y < this.game.rows; y++) {
                            for (let x = 0; x < this.game.columns; x++) {
                                let enemyX = x * this.game.enemySize;
                                let enemyY = y * this.game.enemySize;
                    
                                // Determine the type of alien based on random chance
                                let randomValue = Math.random();
                                if (randomValue < 0.4) {
                                    this.enemies.push(new Alien3(this.game, enemyX, enemyY));
                                } else if (randomValue < 0.7) {
                                    this.enemies.push(new Alien2(this.game, enemyX, enemyY));
                                } else {
                                    this.enemies.push(new Alien1(this.game, enemyX, enemyY));
                                }
                            }
                        }
                    }
                    
                }
    
                class Game {
                    constructor(canvas) {
                        this.canvas = canvas;
                        this.width = this.canvas.width;
                        this.height = this.canvas.height;
                        this.keys = [];
                        this.player = new Player(this);
    
                        this.projectilesPool = [];
                        this.numberOfProjectiles = 10;
                        this.createProjectiles();
                        this.fired = false;
    
                        this.columns = 2;
                        this.rows = 2;
                        this.enemySize = 50;
                        this.enemyProjectiles = [];
    
                        this.waves = [];
                        this.waveCount = 1;
    
                        this.score = 0;
                        this.gameOver = false;
    
                        this.bossArray = [];
                        this.bossLives = 10;
                        this.bossProjectiles = [];
                        this.restart();
    
                        // Event listeners
                        window.addEventListener("keydown", e => {
                            if (e.key === " " && !this.fired) this.player.shoot();
                            this.fired = true;
                            if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key);
                            if (e.key === "r" && this.gameOver) this.restart();
                        });
    
                        window.addEventListener("keyup", e => {
                            this.fired = false;
                            const index = this.keys.indexOf(e.key);
                            if (index > -1) this.keys.splice(index, 1);
                        });
                    }
    
                    render(context) {
                        if (!this.gameOver && this.player.lives > 0) {
                            setHp("3");
                            this.drawStatus(context);
    
                            this.projectilesPool.forEach(projectile => {
                                projectile.update();
                                projectile.draw(context);
                            });
    
                            this.enemyProjectiles = this.enemyProjectiles.filter(enemyProjectile => {
                                return enemyProjectile.position.y + enemyProjectile.height < this.canvas.height;
                            });
    
                            this.enemyProjectiles.forEach(enemyProjectile => {
                                enemyProjectile.update();
                            })
    
                            this.bossProjectiles = this.bossProjectiles.filter(bossProjectile => {
                                return bossProjectile.position.y + bossProjectile.height < this.canvas.height;
                            });
                            
                            this.bossProjectiles.forEach(bossProjectile => {
                                bossProjectile.update();
                            })
    
                            this.player.draw(context);
                            this.player.update();
    
                            this.bossArray.forEach(boss => {
                                boss.draw(context);
                                boss.update();
    
                                // Boss has a chance to shoot a bullet
                                if (Math.random() < 0.01) {
                                    boss.shoot(this.bossProjectiles);
                                }
                            });
    
                            this.bossArray = this.bossArray.filter(object => !object.markedForDeletion);
    
                            this.waves.forEach(wave => {
                                wave.render(context);
    
                                if (wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver) {
                                    this.newWave();
                                    wave.nextWaveTrigger = true;
                                }
                            });
                        } else if (this.player.lives < 1) {
                            setHp("0");
                            setScores(this.score);
                        }
                    }
    
                    // Create projectiles object pool
                    createProjectiles() {
                        for (let i = 0; i < this.numberOfProjectiles; i++) {
                            this.projectilesPool.push(new Projectile());
                        }
                    }
    
                    // Get free projectile object from the pool
                    getProjectile() {
                        for (let i = 0; i < this.projectilesPool.length; i++) {
                            if (this.projectilesPool[i].free) {
                                return this.projectilesPool[i];
                            }
                        }
                    }
    
                    // Collision detection
                    checkCollision(a, b) {
                        return (
                            a.x < b.x + b.width &&
                            a.x + a.width > b.x &&
                            a.y < b.y + b.height &&
                            a.y + a.height > b.y
                        )
                    }
    
                    // Draw status
                    drawStatus(context) {
                        context.save();
                        context.shadowOffsetX = 2;
                        context.shadowOffsety = 2;
                        context.shadowColor = "grey";
                        context.font = "20px Arial";
    
                        context.fillText("Score: " + this.score, 20, 20);
                        context.fillText("Wave: " + this.waveCount, 20, 45);
    
                        for (let i = 0; i < this.player.lives; i++) {
                            context.fillRect(20 + 10 * i, 60, 5, 20);
                        }
    
                        context.restore();
    
                        context.save();
                        this.player.cooldown ? context.fillStyle = "red" : context.fillStyle = "gold";
                        for (let i = 0; i < this.player.energy; i++) {
                            context.fillRect(20 + 2 * i, 90, 2, 10);
                        }
                        context.restore();
                    }
    
                    newWave() {
                        this.waveCount++;
                        if (this.waveCount % 2 === 0) {
                            this.bossArray.push(new Boss(this, this.bossLives));
                        } else {
                            if (Math.random() < 0.5 && this.columns * this.enemySize < this.width * 0.8) {
                                this.columns++;
                            } else if (this.rows * this.enemySize < this.height * 0.6) {
                                this.rows++;
                            }
    
                            this.waves.push(new Wave(this));
                        }
    
                        this.waves = this.waves.filter(object => !object.markedForDeletion);
                    }
    
                    restart() {
                        this.player.restart();
                        this.columns = 2;
                        this.rows = 2;
                        this.waves = [];
                        this.bossArray = [];
                        this.bossLives = 10;
                        this.bossArray.push(new Boss(this, this.bossLives));
                        this.waveCount = 1;
                        this.score = 0;
                        setScores(0);
                        setHp("3");
                        this.gameOver = false;
                    }
                }
    
                const game = new Game(canvas);
                const particles = [];
    
                function createParticles({object, color, fades}) {
                    for (let i = 0; i < 15; i++) {
                        particles.push(new Particle({
                            position: {
                                x: object.x + object.width / 2,
                                y: object.y + object.height / 2
                            },
                            velocity: {
                                x: (Math.random() - 0.5) * 2,
                                y: (Math.random() - 0.5) * 2
                            },
                            radius: Math.random() * 3,
                            color: color || "red",
                            fades
                        }));
                    }
                };
    
                function animate() {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    game.render(context);
                    particles.forEach((particle, i) => {
                        if (particle.position.y - particle.radius >= canvas.height) {
                            particle.position.x = Math.random() * canvas.width;
                            particle.position.y = -particle.radius;
                        }
        
                        if (particle.opacity <= 0) {
                            setTimeout(() => {
                                particles.splice(i, 1);
                            }, 0)
                        } else {
                            particle.update();
                        }
                        
                    });
                    window.requestAnimationFrame(animate);
                }
    
                animate();
            }
        } catch(e) {
            console.log(e);
        }
    }, []);

    return <canvas ref={ref}/>;
};

export default Canvas;
