// ============================================================================
// HUD Rendering Layer
// ----------------------------------------------------------------------------
// Called by controller inside render pipeline.
// Responsible for drawing all on-screen HUD text score, ammo, lives, 
// pause/resume prompts, win/lose messages, etc).
// No game logic is executed here — this function only handles text rendering.
// ============================================================================

function renderHUDLayer(device, game) 
{
    try 
    {
        const cw = game.gameConsts.SCREEN_WIDTH;
        const ch = game.gameConsts.SCREEN_HEIGHT;
        
        // Define layout positions as percentages of canvas height/width
        const layout = 
        {
            hudAmmoX: 0.20,                        // Left-side HUD text (Ammo)
            hudLivesX: 0.70,                       // Right-side HUD text (Lives)
            hudY: .07,                             // HUD vertical placement 1   ammo, lives
            hudY2: .095,                           // HUD vertical placement 2   score
            hudY3: .05,                            // HUD vertical placement 3   clock               
        };

        // Set default font and color
        device.setFont(game.gameConsts.FONT_SETTINGS);
        device.colorText(game.gameConsts.FONT_COLOR);
        
        switch (game.gameState) 
        {
            // ==============================
            // INIT STATE: instructions
            // ==============================
            case GameDefs.gameStates.INIT:
                try
                {
                }
                catch (e) 
                {
                    console.error("Error rendering INIT HUD:", e);
                }
                break;

            // ==============================
            // PLAY STATE: HUD elements (score, ammo, lives)
            // ==============================
            case GameDefs.gameStates.PLAY:
                try
                {
                    board = game.billBoards.getObjectByName(GameDefs.billBoardTypes.HUD.type);
                    const hudImg = device.images.getImage(GameDefs.billBoardTypes.HUD.type);

                    if (board && hudImg) 
                    {
                        try {
                            device.renderImage(hudImg, board.posX, board.posY, game.gameConsts.SCREEN_WIDTH, game.gameConsts.SCREEN_HEIGHT * game.gameConsts.HUD_BUFFER);
                        } 
                        catch (e) 
                        {
                            console.error("Failed to render HUDImg:", e);
                        }
                    }

                    const scoreText = GameDefs.gameTexts.HUD.SCORE + game.score;
                    const livesText = GameDefs.gameTexts.HUD.LIVES + game.lives;
                    const timer = game.gameTimers.getObjectByName(GameDefs.timerTypes.GAME_CLOCK);
                    // const ammoText = GameDefs.gameTexts.HUD.AMMO + game.ammo;

                    device.colorText("red");
                    device.putText(scoreText, cw * layout.hudAmmoX, ch * layout.hudY);
                    device.putText(livesText, cw * layout.hudLivesX, ch * layout.hudY);
                    // device.centerTextOnY(scoreText, ch * layout.hudY2);
                    // device.putText(ammoText, cw * layout.hudAmmoX, ch * layout.hudY);
                    device.centerTextOnY(`Clock: ${timer.formatted}`, (ch * layout.hudY) );  
                }
                catch (e) 
                {
                    console.error("Error rendering play HUD:", e);
                }
                break;

            // ==============================
            // PAUSE STATE: Resume prompt
            // ==============================
            case GameDefs.gameStates.PAUSE:
                try 
                {
                } 
                catch (e) 
                {
                    console.error("Error rendering pause HUD: ", e);
                }
                break;

            // ==============================
            // WIN STATE: Replay prompt
            // ==============================
            case GameDefs.gameStates.WIN:
                try 
                {
                } 
                catch (e) 
                {
                    console.error("Error rendering win HUD:", e);
                }
                break;

            // ==============================
            // LOSE STATE: Restart/Revive prompt
            // ==============================
            case GameDefs.gameStates.LOSE:
                try 
                {
                } 
                catch (e) 
                {
                    console.error("Error rendering lose HUD:", e);
                }
                break;

            default:
                console.warn("Unknown game state in HUD layer:", game.gameState);
                break;
        }
    } 
    catch (e) 
    {
        console.error("Unexpected error in renderHUDLayer:", e);
    }
}

// Wrap it in a Layer object for controller
const hudRenderLayer = new Layer("HUD/Text", renderHUDLayer);
