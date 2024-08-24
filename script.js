const display = document.getElementById('screen');
const audioPlayer = document.getElementById('audio');
const backgroundPlayer = document.getElementById('backgroundAudio');

class warningScreen{
    warn(text, run_function){
        const warnScreen = document.createElement('div');
        warnScreen.id = 'warn_screen'

        const warnText = document.createElement('div');
        warnText.classList.add('warn_text');

        const yes = document.createElement('button');
        yes.textContent = 'Yes';

        const cancel = document.createElement('button');
        cancel.textContent = 'Cancel';

        warnText.innerHTML = text
        warnScreen.append(warnText, yes, cancel)
        display.append(warnScreen)

        yes.addEventListener('click', ()=>{
            warnScreen.remove()
            run_function()
        })
        cancel.addEventListener('click', ()=>{
            warnScreen.remove()
        })
    }
}

function main_menu() {
    audioPlayer.currenttime = 0;
    if (!audioPlayer.paused){
        audioPlayer.pause();
    }

    backgroundPlayer.currenttime = 0;
    if (!backgroundPlayer.paused){
        backgroundPlayer.pause();
    }

    display.innerHTML = '';
    display.innerHTML = '<h1 class="title2">Life and Death</h1>'

    const loadMenu = document.createElement('div');
    loadMenu.classList.add('load-menu');

    const play = document.createElement('button');
    play.textContent = 'Play';
    play.id = 'play';

    const info = document.createElement('button');
    info.textContent = 'Info';
    info.id = 'info';

    loadMenu.appendChild(play);
    loadMenu.appendChild(info);

    display.appendChild(loadMenu);

    play.addEventListener('click', () => {
        load_game(5500, 600);
        // load_game(1500, 600);
        // load_game(1, 1)
    });
    info.addEventListener('click', () => {
        load_credits();
    })
}

function load_game(load_time, screen_open) {
    display.innerHTML = '<h1 class="title">Life and Death</h1>  <div id="loader"> <div id="loaded"></div> </div>';
    
    let game_load_texts = ["You can press the 'esc' key to exit or pause the game.", "Made with Love by MrLwitwma.", "Remeber life is precious don't waste it.", "One Life, One Chance", "The longer you live the more you know."]

    const loadText = document.createElement('div');
    loadText.classList.add('load_text')
    display.append(loadText)

    loadText.textContent = game_load_texts[Math.floor(Math.random() * game_load_texts.length)]
    loadText_Interval = setInterval(function(){
        let num = Math.floor(Math.random() * game_load_texts.length)
        loadText.textContent = game_load_texts[num]
    }, 1900)

    setTimeout(function () {
        clearInterval(loadText_Interval)
        display.style.background = 'white';
        display.innerHTML = "<div class='expanding_square'> </div>";
        setTimeout(function () {
            display.style.background = 'var(--screen)';
            display.innerHTML = '';
            start_game();
        }, screen_open);
    }, load_time);
}

function screen_change(timeout, screen_open, ...newContents){
    decrease_audio(backgroundPlayer, 100)
    setTimeout(function () {
        display.innerHTML = ''
        display.style.background = 'white';
        display.innerHTML = "<div class='expanding_square'> </div>";
        setTimeout(function () {
            display.innerHTML = ''
            display.style.background = 'var(--screen)';
            increase_audio(backgroundPlayer, 200)
            newContents.forEach(content => {
                display.append(content);
            });
        }, screen_open);
    }, timeout);
}

function load_credits(){
    display.innerHTML = `
    <div class='credits'>
        <h1>Life and Death</h1>
        <h2>Created by: Mrlwitwma</h2>
        <img src="other/life.gif" class="life">
        <img src="other/death.gif" class="death">
    </div>`
    audioPlayer.setAttribute('src', "audios/credits.mp3")
    increase_audio(audioPlayer, 500)
    audioPlayer.loop = true
    audioPlayer.play()
}

function increase_audio(player, increaseInterval) {
    let volume = player.volume; // Get current volume from player
    if (volume >= 1) {
        return; // Exit function if volume is already at maximum
    }
    let playerInterval = setInterval(function() {
        if (volume >= 1) {
            clearInterval(playerInterval);
        } else {
            volume = Math.min(1, volume + 0.1); // Ensure volume does not exceed 1
            player.volume = volume;
        }
    }, increaseInterval);
}


function decrease_audio(player, decreaseInterval) {
    let volume = player.volume; // Get current volume from player
    if (volume <= 0) {
        return; // Exit function if volume is already at minimum
    }
    let interval = setInterval(function() {
        if (volume <= 0) {
            clearInterval(interval);
        } else {
            volume = Math.max(0, volume - 0.1); // Ensure volume does not go below 0
            player.volume = volume;
        }
    }, decreaseInterval);
}


function load_entity(id){
    const entity = document.createElement('div');
    const entityImg = document.createElement('img');
    if (id === 0){
        entityImg.setAttribute('src', 'characters/dead/stable.gif');
    }
    entity.append(entityImg)
    display.append(entity);

    return entity
}


class Character {
    constructor(name, id) {
        this.name = name;


        const levelDisplay = document.createElement('div');
        levelDisplay.id = 'level_display';
        const levelCount = document.createElement('span');
        const levelHint = document.createElement('span');

        this.levelCount = levelCount;
        this.levelHint = levelHint;
        this.levelDisplay = levelDisplay;

        this.levelCount.textContent = 'Level 0'
        this.levelHint.textContent = 'Use the D key to move right'
        this.levelDisplay.append(this.levelCount, this.levelHint);


        const mainCharacter = document.createElement('div');
        mainCharacter.id = 'character';

        mainCharacter.style.top = display.clientHeight / 2 + 'px';
        mainCharacter.style.left = '5%';

        const model = document.createElement('div');
        const modelImg = document.createElement('img');
        if (id == 0) {
            this.modelName = 'alex';
            modelImg.setAttribute('src', `/characters/${this.modelName}/stable.gif`);
            mainCharacter.innerHTML = `<span class='name'> ${name} </span>`;
            model.append(modelImg);
            mainCharacter.append(model);
        }

        this.mainCharacter = mainCharacter;
        this.model = model;
        this.modelImg = modelImg;
        this.currentLevel = 0;
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false
        };
        
        
        display.append(mainCharacter, levelDisplay);
    }

    move() {
        const speed = 3;
        let dx = 0;
        let dy = 0;

        if (this.direction.up){
            dy -= speed;
            this.action(2);
        }
        if (this.direction.down){
            dy += speed;
            this.action(2);
        } 
        if (this.direction.left) {
            dx -= speed;
            this.model.style.transform = 'scaleX(-1)';
            this.action(2)
        }
        if (this.direction.right) {
            dx += speed;
            this.model.style.transform = 'scaleX(1)';
            this.action(2)
        }

        let currentLeft = parseFloat(this.mainCharacter.style.left) || 0;
        let currentTop = parseFloat(this.mainCharacter.style.top) || 0;


        const displayWidth = display.clientWidth;
        const displayHeight = display.clientHeight;
        
        // this.mainCharacter.style.left -= 100
        if (currentLeft + dx < 0 || currentLeft + dx > displayWidth - this.mainCharacter.clientWidth ||
            currentTop + dy < 0 || currentTop + dy > displayHeight - this.mainCharacter.clientHeight) {
            if (this.currentLevel === 0 && currentLeft + dx > displayWidth - this.mainCharacter.clientWidth){
                this.update_level('Use the A key to move left')
                screen_change(0, 600, this.mainCharacter, this.levelDisplay)
                this.mainCharacter.style.left = displayWidth / 2 + 'px'
                this.mainCharacter.style.top = displayHeight / 2 + 'px'
                this.zombie = load_entity(0)
            } else if (this.currentLevel === 1 && currentLeft + dx < 0){
                this.update_level('Use the W key to move top')
                screen_change(0, 600, this.mainCharacter, this.levelDisplay)
                this.mainCharacter.style.left = displayWidth / 2 + 'px'
                this.mainCharacter.style.top = displayHeight / 2 + 'px'
                this.zombie.remove()
            } else if (this.currentLevel === 2 && currentTop + dy < 0){
                this.update_level('Use the S key to move bottom')
                screen_change(0, 600, this.mainCharacter, this.levelDisplay)
                this.mainCharacter.style.left = displayWidth / 2 + 'px'
                this.mainCharacter.style.top = displayHeight / 2 + 'px'
            } else if (this.currentLevel === 3 && currentTop + dy > displayHeight - this.mainCharacter.clientHeight){
                this.update_level('Press esc to quit Game')
                screen_change(0, 600, this.mainCharacter, this.levelDisplay)
                this.mainCharacter.style.top = displayHeight / 2 + 'px';
            }
        } else{
            this.mainCharacter.style.left = (currentLeft + dx) + 'px';
            this.mainCharacter.style.top = (currentTop + dy) + 'px';
        }
    }

    action(action) {
        /*
        0 - Stable
        1 - Jump
        2 - Walk
        3 - Run
        4 - Attack
        5 - Death
        */
        if (action === 0 && !this.modelImg.src.includes('stable.gif')) {
            if (!audioPlayer.paused) {
                audioPlayer.pause();
            }
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/stable.gif`);
        } else if (action === 1 && !this.modelImg.src.includes('jump.gif')) {
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/jump.gif`);
            setTimeout(() => this.action(0), 2000); // Switch back to stable after 2 seconds
        } else if (action === 2 && !this.modelImg.src.includes('walk.gif')) {
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/walk.gif`);
            audioPlayer.setAttribute('src', 'audios/walk.mp3');
            audioPlayer.loop = true;
            audioPlayer.play();
        } else if (action === 3 && !this.modelImg.src.includes('run.gif')) {
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/run.gif`);
            if (!audioPlayer.paused) {
                audioPlayer.pause();
            }
        } else if (action === 4 && !this.modelImg.src.includes('attack.gif')) {
            audioPlayer.pause();
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/attack.gif`);
            setTimeout(() => this.action(0), 800);
        } else if (action === 5 && !this.modelImg.src.includes('death.gif')) {
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/death.gif`);
        }
    }
    update_level(hint){
        this.levelHint.textContent = hint
        this.currentLevel += 1
        this.levelCount.textContent = `Level ${this.currentLevel}`
    }
}

function start_game() {
    const character = new Character('Alex', 0);

    backgroundPlayer.loop = true
    backgroundPlayer.play()

    document.addEventListener('keydown', (event) => {
        const keyName = event.key.toUpperCase();

        switch (keyName) {
            case 'W':
            case 'ARROW_UP':
                character.direction.up = true;
                break;
            case 'A':
            case 'ARROW_LEFT':
                character.direction.left = true;
                break;
            case 'S':
            case 'ARROW_DOWN':
                character.direction.down = true;
                break;
            case 'D':
            case 'ARROW_RIGHT':
                character.direction.right = true;
                break;
            case ' ':
            case 'SPACE':
                character.action(4);
                // setTimeout(() => zombie.remove(), 600);
                break;
        }
    });

    document.addEventListener('keyup', (event) => {
        const keyName = event.key.toUpperCase();

        switch (keyName) {
            case 'W':
            case 'ARROW_UP':
                character.direction.up = false;
                character.action(0)
                break;
            case 'A':
            case 'ARROW_LEFT':
                character.direction.left = false;
                character.action(0)
                break;
            case 'S':
            case 'ARROW_DOWN':
                character.direction.down = false;
                character.action(0)
                break;
            case 'D':
            case 'ARROW_RIGHT':
                character.direction.right = false;
                character.action(0)
                break;
        }
    });

    // Animation loop to move character
    function animate() {
        character.move();
        requestAnimationFrame(animate);
    }
    animate();
}



document.addEventListener('visibilitychange', ()=>{
    if (document.hidden) {
        audioPlayer.pause();
    } else{
        audioPlayer.volume = 0.1
        audioPlayer.play();
        increase_audio(audioPlayer, 1000);
    }
})

document.addEventListener('DOMContentLoaded', () => {
    main_menu();
    document.addEventListener('keydown', (event) => {
        if ((event.key === 'Escape' || event.code === 'Escape')) {
            warnDisplay = new warningScreen 
            warnDisplay.warn('Are you sure you want to quit?', main_menu);
            event.preventDefault();
        }
    });
});
