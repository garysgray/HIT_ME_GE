// =======================================================
// gameConfig.js
// -------------------------------------------------------
// Purpose:
// Acts as the **central data hub** for the game. 
// - Stores immutable constants (dimensions, speeds, input keys).
// - Defines enumerated game states and play modes.
// - Maintains all core state values (score, lives, ammo, etc).
// - Holds references to major objects (player, sprites, projectiles).
// - Provides controlled accessors & mutators to manage game state.
// 
// Note: This class does NOT run the game loop. Instead, it serves as 
// a structured container that other systems (like controller.js) use 
// to coordinate the game’s logic.
// =======================================================

// -----------------------------
// Game Class
// -----------------------------
class Game 
{
    // ---- Private fields ---- 
    #gameConsts;
    #billBoards;
    #gameTimers;
    #canvasWidth;
    #canvasHeight;
    #canvasHalfW;
    #canvasHalfH
    #gameState;
    #score;
    #lives;
    #player;

    // #projectiles;
    // #gameSprites;
    // #playState;
    // #ammo;
    // #savedPlayState;
    // #npcSpeedMultiplyer;
    
    // ---- Constructor ----
    constructor() 
    {
        // Core systems
        try 
        {
            this.#gameConsts   = new GameConsts();
            this.#billBoards   = new ObjHolder();
            this.#gameTimers   = new ObjHolder();

            // this.#projectiles  = new ObjHolder();
            // this.#gameSprites  = new ObjHolder();
        }
        catch (err) 
        {
            console.error("Failed to initialize object holders:", err);
        }

        // Dimensions
        this.#canvasWidth  = this.#gameConsts.SCREEN_WIDTH;
        this.#canvasHeight = this.#gameConsts.SCREEN_HEIGHT;
        this.#canvasHalfW  = this.#canvasWidth * .5
        this.#canvasHalfH  = this.#canvasHeight * .5

        // Default states
        this.#gameState = GameDefs.gameStates.INIT;

        // Gameplay variables
        this.#score  = 0;
        this.#lives  = 0;

        //this.#playState = GameDefs.playStates.AVOID;  
        //this.savedPlayState = GameDefs.playStates.AVOID;
        // this.#ammo   = 0;
        // this.#npcSpeedMultiplyer = 0;

        try 
        {
            this.#player = new Player(GameDefs.spriteTypes.PLAYER.w, GameDefs.spriteTypes.PLAYER.h, this.#canvasHalfW, this.#canvasHeight, this.#gameConsts.PLAYER_SPEED);
        }
        catch (err) 
        {
            console.error("Failed to initialize player:", err);
        }
    }
    
    // -----------------------------
    // Accessors
    // -----------------------------
    get gameConsts()   { return this.#gameConsts; }
    get billBoards()  { return this.#billBoards; }
    get gameTimers()  { return this.#gameTimers; }
    get canvasWidth()  { return this.#canvasWidth; }
    get canvasHeight() { return this.#canvasHeight; }
    get canvasHalfW()  { return this.#canvasHalfW; }
    get canvasHalfH()  { return this.#canvasHalfH; }
    get gameState()    { return this.#gameState; }
    get score()        { return this.#score; }
    get player()       { return this.#player; }

    // get projectiles()  { return this.#projectiles; }
    // get gameSprites()  { return this.#gameSprites; } 
    // get playState()    { return this.#playState; }
    // get lives()        { return this.#lives; }
    // get ammo()         { return this.#ammo; } 
    // get savedPlayState() { return this.#savedPlayState; }
    // get npcSpeedMuliplyer() { return this.#npcSpeedMultiplyer; } 
   
    
    // -----------------------------
    // Mutators
    // -----------------------------
    set gameState(v)    { this.#gameState = v; }
    set score(v)        { this.#score = v; }

    decreaseLives(a)    { this.#lives -= a; }
    increaseScore(a)    { this.#score += a; }

    // // Functions to set Game and Play states
    setGameState(state)     { this.#gameState = state; }

    // -----------------------------
    // Game Setup
    // -----------------------------
    initGame(device) 
    {   
        try 
        {
            // Input
            device.keys.initKeys();

            // Load game object sprite assets into device images
            Object.values(GameDefs.spriteTypes).forEach(spriteDef => 
            {
                if (spriteDef.path) 
                {
                    try 
                    {
                        const sprite = new Sprite(spriteDef.path, spriteDef.type);
                        device.images.addObject(sprite);
                    }
                    catch (err) 
                    {
                        console.error(`Failed to load sprite "${spriteDef.type}":`, err);
                    }
                }
            });

            // Load billboard sprite assets into device images
            Object.values(GameDefs.billBoardTypes).forEach(boardDef => 
            {
                if (boardDef.path) {
                    try 
                    {
                        const boardSprite = new Sprite(boardDef.path, boardDef.type);
                        device.images.addObject(boardSprite);
                    } 
                    catch (err)
                    {
                        console.error(`Failed to load billboard "${boardDef.type}":`, err);
                    }
                }
            });

            // Initialize boards into an array using definitions 
            const boards = [
                //new BillBoard(GameDefs.billBoardTypes.BACKGROUND.type, GameDefs.billBoardTypes.BACKGROUND.w, GameDefs.billBoardTypes.BACKGROUND.h, 0, 0, 0, GameDefs.billBoardTypes.BACKGROUND.isCenter),
                new ParallaxBillBoard(GameDefs.billBoardTypes.BACKGROUND.type, GameDefs.billBoardTypes.BACKGROUND.w, GameDefs.billBoardTypes.BACKGROUND.h, 0, 0, 60, GameDefs.billBoardTypes.BACKGROUND.isCenter, GameDefs.parallexType.HORIZONTAL),
                new BillBoard(GameDefs.billBoardTypes.HUD.type,        GameDefs.billBoardTypes.HUD.w,        GameDefs.billBoardTypes.HUD.h,        0, 0, 0, GameDefs.billBoardTypes.HUD.isCenter),
                new BillBoard(GameDefs.billBoardTypes.SPLASH.type,     GameDefs.billBoardTypes.SPLASH.w,     GameDefs.billBoardTypes.SPLASH.h,     0, 0, 0, GameDefs.billBoardTypes.SPLASH.isCenter),
                new BillBoard(GameDefs.billBoardTypes.PAUSE.type,      GameDefs.billBoardTypes.PAUSE.w,      GameDefs.billBoardTypes.PAUSE.h,      0, 0, 0, GameDefs.billBoardTypes.PAUSE.isCenter),
                new BillBoard(GameDefs.billBoardTypes.WIN.type,        GameDefs.billBoardTypes.WIN.w,        GameDefs.billBoardTypes.WIN.h,        0, 0, 0, GameDefs.billBoardTypes.WIN.isCenter),   
                new BillBoard(GameDefs.billBoardTypes.LOSE.type,       GameDefs.billBoardTypes.LOSE.w,       GameDefs.billBoardTypes.LOSE.h,       0, 0, 0, GameDefs.billBoardTypes.LOSE.isCenter),   
            ];

            // Some billboards are ment to be centered in play screen so we set the positions here (billboards have a bool to see if there centered)
            // then it gets added to the billboards obj holder
            boards.forEach(board => 
            {
                try 
                {
                    board.centerObjectInWorld(this.#gameConsts.SCREEN_WIDTH, this.#gameConsts.SCREEN_HEIGHT);
                    this.#billBoards.addObject(board);
                } 
                catch (err) 
                {
                    console.error(`Failed to add board "${board.name}":`, err);
                }
            });


            //Initialize sounds into device audio
            Object.values(GameDefs.soundTypes).forEach(sndDef => 
            {
                if (sndDef.path) {
                    try 
                    {
                        device.audio.addSound(sndDef.name, sndDef.path, this.gameConsts.POOLSIZE, this.gameConsts.VOLUME);
                    } 
                    catch (err) 
                    {
                        console.error(`Failed to add sound "${sndDef.name}":`, err);
                    }
                }
            });

            // // Initialize all game related timers and load into gameTimers
            const timers = 
            [
                new Timer(GameDefs.timerTypes.GAME_CLOCK, 0, GameDefs.timerModes.COUNTUP),
            ];
            
            timers.forEach(timer => 
            {
                try 
                {
                    this.#gameTimers.addObject(timer);
                } 
                catch (err) 
                {
                    console.error("Failed to add timer:", err);
                }
            });
        }
        catch (err) 
        {
            console.error("Error initializing game:", err);
        }
    }

    // Reset values each time a game starts
    setGame(device) 
    { 
        this.score     = 0;
        this.lives     = this.#gameConsts.GAME_LIVES_START_AMOUNT;
        this.gameTimers.getObjectByName(GameDefs.timerTypes.GAME_CLOCK).start();

        this.player.setMouseToPlayer(device);
        // this.ammo      = 0;
        // this.gameSprites.clearObjects();
        // this.projectiles.clearObjects();
        //this.setPlayState(GameDefs.playStates.AVOID); 
    }
}



    // savePlayState(state)    { this.#savedPlayState = state; }
    // restorePlayState()      { this.#playState = this.#savedPlayState; }
    //setPlayState(playstate) { this.#playState = playstate; }

    //set playState(v)    { this.#playState = v; }
    //set lives(v)        { this.#lives = v; }
    // set ammo(v)         { this.#ammo = v; }
    // set savedPlayState(v) { this.#savedPlayState = v; }
    // set npcSpeedMuliplyer(v) { this.#npcSpeedMultiplyer = v; }
    // // Convenience modifiers
    // emptyAmmo()         { this.#ammo = 0; }    
    // increaseAmmo(a)     { this.#ammo += a; }
    // decreaseAmmo(a)     { this.#ammo -= a; }
    