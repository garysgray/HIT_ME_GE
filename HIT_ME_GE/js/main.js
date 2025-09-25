// ============================================================================
// MAIN.js  MAIN POINT oF ENTRY
// GameLoop resides here! Was called thru index.html
// ============================================================================

// ============================================================================
// DEBUG/TESTING CONTROL AREA
// ============================================================================
let HIT_BOXES = false;
let DEBUG_TEXT = false;

 HIT_BOXES = true;
 DEBUG_TEXT = true;

let DRAW_DEBUG_TEXT = false; 
let DRAW_DEBUG_HITBOXES = false;

if (HIT_BOXES) DRAW_DEBUG_HITBOXES = true;
if (DEBUG_TEXT) DRAW_DEBUG_TEXT = true;

// ============================================================================
// Main entry point for the Avoider game
// ============================================================================
let myController;

try 
{
    myController = new Controller();
} 
catch (e) 
{
    console.error("Failed to create Controller instance:", e);
}

// ---------------------------------------------------------------------------
// Fixed timestep game loop setup
// ---------------------------------------------------------------------------

let lastTime = performance.now();
let accumulator = 0;
// --------------------------------------------------------------------------- 
// Main game loop with safety checks
// ---------------------------------------------------------------------------
function gameLoop() 
{

    const fixedStep = 1 / 60;
    const timeInSecs = 1000;
    const frameTimeMax = 0.25;

    try 
    {
        if (!myController) return;

        const now = performance.now();
        let frameTime = (now - lastTime) / timeInSecs;
        lastTime = now;

        if (frameTime > frameTimeMax) 
        {
            frameTime = frameTimeMax;
        }

        accumulator += frameTime;

        while (accumulator >= fixedStep) 
        {
            try
            {
                myController.updateGame(fixedStep);
            }
            catch (e)
            {
                console.error("Error during updateGame():", e);
            }

            accumulator -= fixedStep;
        }

        if (DRAW_DEBUG_TEXT)
        {            
            texts= [
               //"debug text1 here, saying what up!!!!",
               //"player posX: " + myController.game.player.posX,
               "player speed: " + myController.game.player.speed,
               "Game State: " + myController.game.gameState,
            ];

            renderDebugText(texts);  
        }
    } 
    catch (e) 
    {
        console.error("Unexpected error in gameLoop:", e);
    } 
    finally 
    {
        try 
        {
            requestAnimationFrame(gameLoop);
        }
        catch (e) 
        {
            console.error("Failed to request next animation frame:", e);
        }
    }
}

// called from window.onload() in index.html
function startGameLoop() 
{
    try 
    {
        gameLoop();
    } 
    catch (e)
    {
        console.error("Failed to start game loop:", e);
    }
}

function renderDebugText(texts)
{
    const posX  = myController.game.gameConsts.SCREEN_WIDTH   * 0.03;
    let posY    = myController.game.gameConsts.SCREEN_HEIGHT  * 0.2;
    const buffY = myController.game.gameConsts.SCREEN_HEIGHT  * 0.05;

    texts.forEach(text => 
    {
        myController.device.debugText(text, posX, posY, myController.game.gameConsts.DEBUG_TEXT_COLOR);
        posY += buffY;
    });
}