const display = document.getElementById('screen');
const audioPlayer = document.getElementById('audio');


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
    audioPlayer.pause();

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
        // load_game(5500, 600);
        // load_game(1500, 600);
        load_game(1, 1)
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

function load_credits(){
    display.innerHTML = `
    <div class='credits'>
        <h1>Life and Death</h1>
        <h2>Created by: Mrlwitwma</h2>
        <img src="/other/life.gif" class="life">
        <img src="/other/death.gif" class="death">
    </div>`
    audioPlayer.setAttribute('src', "/audios/credits.mp3")
    increase_audio(audioPlayer, 500)
    audioPlayer.loop = true
    audioPlayer.play()
}

function increase_audio(player, increaseInterval){
    player.volume = 0
    interval = setInterval(
        function(){
            player.volume += 0.1
            if (player.volume === 1){
                clearInterval(interval)
            }
        }, increaseInterval
    )
}

function decrease_audio(player, decreaseInterval){
    interval = setInterval(
        function(){
            player.volume -= 0.1
            if (player.volume === 0){
                clearInterval(interval)
            }
        }, decreaseInterval
    )
}


class Character {
    constructor(name, id) {
        this.name = name;

        const mainCharacter = document.createElement('div');
        mainCharacter.id = 'character';

        mainCharacter.style.top = '10%';
        mainCharacter.style.left = '5%';

        const model = document.createElement('div');
        const modelImg = document.createElement('img');
        if (id == 0) {
            this.modelName = 'alex';
            modelImg.setAttribute('src', '/characters/alex/stable.gif');
            mainCharacter.innerHTML = `<span class='name'> ${name} </span>`;
            model.append(modelImg);
            mainCharacter.append(model);
        }

        this.mainCharacter = mainCharacter;
        this.model = model;
        this.modelImg = modelImg;
        display.append(mainCharacter);
        
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    move() {
        const speed = 1.8;
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

        this.mainCharacter.style.left = (currentLeft + dx) + 'px';
        this.mainCharacter.style.top = (currentTop + dy) + 'px';
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
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/stable.gif`);
        } else if (action === 1 && !this.modelImg.src.includes('jump.gif')) {
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/jump.gif`);
            setTimeout(() => this.action(0), 2000); // Switch back to stable after 2 seconds
        } else if (action === 2 && !this.modelImg.src.includes('walk.gif')) {
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/walk.gif`);
        } else if (action === 3 && !this.modelImg.src.includes('run.gif')) {
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/run.gif`);
        } else if (action === 4 && !this.modelImg.src.includes('attack.gif')) {
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/attack.gif`);
            setTimeout(() => this.action(0), 800);
        } else if (action === 5 && !this.modelImg.src.includes('death.gif')) {
            this.modelImg.setAttribute('src', `/characters/${this.modelName}/death.gif`);
        }
    }
}

function start_game() {
    const character = new Character('Alex', 0);

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