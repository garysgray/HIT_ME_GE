// =======================================================
// GameDefs.js
// -------------------------------------------------------
// Purpose:
// Immutable enumerations, texts, billboard & sprite configs.
// =======================================================

const GameDefs = Object.freeze({
    gameStates: {
        INIT: 0,
        PLAY: 1,
        PAUSE: 2,
        WIN: 3,
        LOSE: 4
    },

    playStates: {
        ALIVE: 0,
        DEAD: 1,
    },

    spriteTypes: {
        PLAYER:   { type: "player",    w: 32, h: 32, path: "assets/sprites/ship.png" },
    },

    billBoardTypes: {
        BACKGROUND: { type: "background", w: 600, h: 600, path: "assets/sprites/genericGameScreen.png", isCenter: false },
        HUD:        { type: "hud",        w: 850, h: 200, path: "assets/sprites/hud.png" , isCenter: false },
        SPLASH:     { type: "splash",     w: 400, h: 100, path: "assets/sprites/splash.png" , isCenter: true },
        PAUSE:      { type: "pause",      w: 400, h: 100, path: "assets/sprites/pause.png" , isCenter: true },
        WIN:        { type: "win",        w: 400, h: 100, path: "assets/sprites/win.png" , isCenter: true },
        LOSE:       { type: "lose",       w: 400, h: 100, path: "assets/sprites/lose.png" , isCenter: true },
    },

    soundTypes: {
        SHOOT:   { name: "shoot",   path: "assets/sounds/shoot.wav" },
    },

    keyTypes: {
        PLAY_KEY: "Space",
        RESET_KEY: "Space",
        PAUSE_KEY_L: "ControlLeft",
        UP: "ArrowUp",
        DOWN: "ArrowDown",
        LEFT: "ArrowLeft",
        RIGHT: "ArrowRight",
        W: "KeyW",
        S: "KeyS",
        A: "KeyA",
        D: "KeyD"
    },

    gameTexts: {
        INIT: {
            INSTRUCTIONS: [
                "Some Init Text for show",
                "the text allignment layout array ",
                "is located in the:",
                "textRenderLayer.js"
            ]
        },
        HUD: {
            SCORE: "Score: ",
            LIVES: "Lives: "
        },
        PAUSE: {
            MESSAGE: "PRESS  CTRL  TO  RESUME  GAME"
        },
        WIN: {
            MESSAGE: "PRESS  ENTER  TO  PLAY  AGAIN"
        },
        LOSE: {
            LOSE_MESSAGE: "YOU  LOST,  SPACE-BAR  TO  RETRY",
            DIE_MESSAGE: "YOU  DIED,  SPACE-BAR  TO  REVIVE"
        }
    },

    timerModes: {
        COUNTDOWN: "countdown",
        COUNTUP: "countup",
    },

    timerTypes: {
        SHOOT_COOL_DOWN_TIMER: "shootCooldownTimer",
        GAME_CLOCK: "gameClock",
    }

});

// -----------------------------
// Global Constants
// -----------------------------
class GameConsts 
{
    // ---- Private fields ----
    //sizes
    #SCREEN_WIDTH = 1000;
    #SCREEN_HEIGHT = 600;

    //times
    #FALLBACK_DELTA = 16; // fallback ~60fps
    #SHOOT_COOLDOWN = 0.2; // 200ms

    //amounts
    #GAME_LIVES_START_AMOUNT = 3;
    #HUD_BUFFER = .12;

    //settings
    #DEBUG_TEXT_COLOR = "yellow";
    #FONT_COLOR = 'white'
    #FONT_SETTINGS = `bold 17pt Century Gothic`

    //sound 
    #POOLSIZE = 5;
    #VOLUME = 1.0;

    //speed
    #PLAYER_SPEED = 200;

    // //times
    // #SHIELD_TIME = 3;
    // #NPC_SPEED_INCREASE_INTERVALS = 10;
    // #NPC_SPEED_INCREASE_AMOUNT = 0.2;
    // //amounts
    // #AMMO_AMOUNT = 3; 
    // #SCORE_INCREASE = 10;
    // #SPAWN_ATTEMPTS = 5;
    // //settings
    // #BILLBOARDS_OFFSET_BUFF = 0;
    
    // ---- Getters (expose constants safely) ----
    get SCREEN_WIDTH(){ return this.#SCREEN_WIDTH; }
    get SCREEN_HEIGHT(){ return this.#SCREEN_HEIGHT; }
    get GAME_LIVES_START_AMOUNT(){ return this.#GAME_LIVES_START_AMOUNT; }
    get HUD_BUFFER(){ return this.#HUD_BUFFER; }
    get FALLBACK_DELTA(){ return this.#FALLBACK_DELTA; }
    get SHOOT_COOLDOWN(){ return this.#SHOOT_COOLDOWN; }
    get DEBUG_TEXT_COLOR(){ return this.#DEBUG_TEXT_COLOR; }
    get FONT_SETTINGS(){ return this.#FONT_SETTINGS; }
    get FONT_COLOR(){ return this.#FONT_COLOR; }
    get POOLSIZE(){ return this.#POOLSIZE; }
    get VOLUME(){ return this.#VOLUME; }
    get PLAYER_SPEED(){ return this.#PLAYER_SPEED; }
    
    // get SHIELD_TIME(){ return this.#SHIELD_TIME; }
    // get AMMO_AMOUNT(){ return this.#AMMO_AMOUNT; }
    // get SCORE_INCREASE(){ return this.#SCORE_INCREASE; }
    // get SPAWN_ATTEMPTS(){ return this.#SPAWN_ATTEMPTS; }   
    // get NPC_SPEED_INCREASE_INTERVALS(){ return this.#NPC_SPEED_INCREASE_INTERVALS; }
    // get NPC_SPEED_INCREASE_AMOUNT(){ return this.#NPC_SPEED_INCREASE_AMOUNT; }
    // get BILLBOARDS_OFFSET_BUFF(){ return this.#BILLBOARDS_OFFSET_BUFF; }
    
    
}