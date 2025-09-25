// ============================================================================
// GameObjects Render Layer
// ----------------------------------------------------------------------------
// Handles rendering of all core game visuals (background, splash, objects, player, UI overlays). 
// Called by the Controller during the main update cycle
// Responsible only for drawing (no game logic here)
// Uses game state to decide what to render
// ============================================================================

function renderGameObjectsLayer(device, game) {   
    try 
    {
        // === Render Based on Game State ===
        switch (game.gameState) 
        {
            case GameDefs.gameStates.INIT: 
            {
                
            } 
            break;

            case GameDefs.gameStates.PLAY: 
            {
                try
                {
                    //renderNPCSprites(device, game);
                    //renderProjectiles(device, game);
                    renderPlayer(device, game);
                } 
                catch (e) 
                {
                    console.error("Error rendering gameplay objects:", e);
                }
            }
            break;

            case GameDefs.gameStates.PAUSE:
            {
                
            } 
            break;

            case GameDefs.gameStates.WIN: 
            {
                // Reserved for future win state content
            } 
            break;

            case GameDefs.gameStates.LOSE: 
            {
                try 
                {
                    renderPlayer(device, game);
                } 
                catch (e) 
                {
                    console.error("Failed to render player on lose screen:", e);
                }
            } 
            break;

            default:
                console.warn("Unknown game state:", game.gameState);
                break;
        }
    } 
    catch (e) 
    {
        console.error("Unexpected error in renderGameObjectsLayer:", e);
    }
}

// === Layer Registration ===
const gameObjectsLayer = new Layer("GameObjects", renderGameObjectsLayer);
