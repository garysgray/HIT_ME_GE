// ============================================================================
// Text Rendering Layer
// ----------------------------------------------------------------------------
// Called by controller inside render pipeline.
// Responsible for drawing all on-screen text messages
// pause/resume prompts, win/lose messages, etc).
// No game logic is executed here — this function only handles text rendering.
// ============================================================================

function renderTextLayer(device, game) 
{
    try 
    {
        const cw = game.gameConsts.SCREEN_WIDTH;
        const ch = game.gameConsts.SCREEN_HEIGHT;
        
        // Define layout positions as percentages of canvas height/width
        const layout = 
        {
            initTextY: [0.57, 0.62, 0.67, 0.72],   // Intro screen text lines
            pauseY: 0.57,                          // Pause message placement
            winLoseY: 0.57,                        // Win/Lose screen placement             
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
                    layout.initTextY.forEach((pct, idx) => 
                    {
                        const instructions = GameDefs.gameTexts.INIT.INSTRUCTIONS[idx];
                        
                        device.centerTextOnY(instructions, ch * pct);
                    });
                }
                catch (e) 
                {
                    console.error("Error rendering INIT text:", e);
                }
                break;

            // ==============================
            // PLAY STATE: 
            // ==============================
            case GameDefs.gameStates.PLAY:
                try
                {
                    const pauseMsg = "PRESS  CTRL  TO  PAUSE  GAME";
                    device.centerTextOnY(pauseMsg, ch * layout.pauseY);
                }
                catch (e) 
                {
                    console.error("Error rendering PLAY text:", e);
                }
                break;

            // ==============================
            // PAUSE STATE: Resume prompt
            // ==============================
            case GameDefs.gameStates.PAUSE:
                try 
                {
                    const pauseMsg = GameDefs.gameTexts.PAUSE.MESSAGE;

                    device.colorText("white");
                    device.centerTextOnY(pauseMsg, ch * layout.pauseY);
                    
                } 
                catch (e) 
                {
                    console.error("Error rendering pause text:", e);
                }
                break;

            // ==============================
            // WIN STATE: Replay prompt
            // ==============================
            case GameDefs.gameStates.WIN:
                try 
                {
                    const winMsg = GameDefs.gameTexts.WIN.MESSAGE;

                    device.centerTextOnY(winMsg, ch * layout.winLoseY);
                    
                } 
                catch (e) 
                {
                    console.error("Error rendering win text:", e);
                }
                break;

            // ==============================
            // LOSE STATE: Restart/Revive prompt
            // ==============================
            case GameDefs.gameStates.LOSE:
                try 
                {
                    if (game.lives <= 0) 
                    {
                        const loseMsg = GameDefs.gameTexts.LOSE.LOSE_MESSAGE;

                        device.centerTextOnY(loseMsg, ch * layout.winLoseY);
                        
                    }
                    else 
                    {
                        const dieMsg = GameDefs.gameTexts.LOSE.DIE_MESSAGE;

                        device.centerTextOnY(dieMsg, ch * layout.winLoseY);
                        
                    }
                } 
                catch (e) 
                {
                    console.error("Error rendering lose text:", e);
                }
                break;

            default:
                console.warn("Unknown game state in text layer:", game.gameState);
                break;
        }
    } 
    catch (e) 
    {
        console.error("Unexpected error in renderTextLayer:", e);
    }
}

// Wrap it in a Layer object for controller
const textRenderLayer = new Layer("HUD/Text", renderTextLayer);
