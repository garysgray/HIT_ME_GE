// ============================================================================
// Controller Class (Test-Friendly Version)
// ----------------------------------------------------------------------------
// Works with real Game/Device or with fake/mock classes for Jasmine tests
// ============================================================================
class Controller 
{
    #device;    // Manages canvas and input
    #game;      // Holds core game state and logic
    #layers;    // Array of Layer instances (render order matters)

    // Fake constructor with fake objects for testing
    constructor(GameClass = null, DeviceClass = null, canvasEl = null) 
    {
        // Use real classes if not provided
        const GameCtor = GameClass || (typeof Game !== 'undefined' ? Game : class { initGame() {} });
        const DeviceCtor = DeviceClass || (typeof Device !== 'undefined' ? Device : class {});

        // Initialize Game Object
        try 
        {
            this.#game = new GameCtor();
        } 
        catch (error) 
        {
            console.error("Failed to initialize Game:", error.message);
            alert("An error occurred while initializing the game. Please try again.");
            return;
        }

        // Initialize Device Object
        try 
        {
            this.#device = new DeviceCtor(this.game.gameConsts.SCREEN_WIDTH, this.game.gameConsts.SCREEN_HEIGHT, canvasEl);
        } 
        catch (error) 
        {
            console.error("Failed to initialize Device:", error.message);
            alert("An error occurred while setting up the game environment.");
            return;
        }

        // Initialize layers
        this.#layers = [];

        // Initialize the Game items
        this.initGame();
    }

    // ------------------------------------------------------------------------
    // Getters
    // ------------------------------------------------------------------------
    get device() { return this.#device; }
    get game() { return this.#game; }

    // ------------------------------------------------------------------------
    // Initialize game
    // ------------------------------------------------------------------------
    initGame() 
    {
        try 
        {
            this.#game.initGame(this.#device);

            // Layers have to be rendered in this order
            if (typeof billBoardsLayer !== 'undefined')  this.addLayer(billBoardsLayer);      // game backgrounds
            if (typeof hudRenderLayer !== 'undefined')   this.addLayer(hudRenderLayer);       // game HUD
            if (typeof textRenderLayer !== 'undefined')  this.addLayer(textRenderLayer);      // game text
            if (typeof gameObjectsLayer !== 'undefined') this.addLayer(gameObjectsLayer);     // game objects
            
        }
        catch (error) 
        {
            console.error("Failed to initialize game components:", error.message);
            alert("An error occurred while initializing game components.");
        }
    }

    // ------------------------------------------------------------------------
    // Add a render layer
    // ------------------------------------------------------------------------
    addLayer(layer) 
    {
        try
        {
            if (!layer) throw new Error("Layer is undefined or null.");
            this.#layers.push(layer);
        } 
        catch (error)
        {
            console.error("Error adding layer:", error.message);
            alert("An error occurred while adding a render layer.");
        }
    }

    // ------------------------------------------------------------------------
    // Update + Render
    // ------------------------------------------------------------------------
    updateGame(delta) 
    {
        if (typeof delta !== "number" || delta <= 0) delta = this.game.gameConsts.FALLBACK_DELTA; // fallback ~60fps

        try
        {
            // Update game logic
            updateGameStates(this.#device, this.#game, delta);

            // Render each layer
            for (const layer of this.#layers) 
            {
                try 
                { 
                    layer.render(this.#device, this.#game); 
                } 
                catch (renderError) 
                { 
                    console.error(`Error rendering layer:`, renderError.message); 
                }
            }

            // Clear per-frame input
            this.#device.keys.clearFrameKeys();

        } 
        catch (error)
        {
            console.error("Game update error:", error.message);
            alert("An error occurred during the game update. Please restart.");
        }
    }
}
