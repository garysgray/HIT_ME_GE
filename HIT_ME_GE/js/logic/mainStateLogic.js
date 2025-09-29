// ============================================================================
// MAIN STATE LOGIC
// ----------------------------------------------------------------------------
// Update Game States
// - Called each frame from the controller's update() function
// - Handles updates to core game logic, input responses, and state transitions
// - Calls for all game objects updates depending on current game state
// ============================================================================

function updateGameStates(device, game, delta) 
{
    try 
    {
        switch (game.gameState) 
        {
            // -------------------------------------------------------
            // INIT STATE
            // -------------------------------------------------------
            case GameDefs.gameStates.INIT:
                try 
                {
                    // Set up all the game stuff up and then wait for player to hit "start/play" button
                    game.setGame(device);

                    if (device.keys.isKeyPressed(GameDefs.keyTypes.PLAY_KEY)) 
                    {
                        game.setGameState(GameDefs.gameStates.PLAY);
                    }
                } 
                catch (e) 
                {
                    console.error("INIT state error:", e);
                }
                break;

            // -------------------------------------------------------
            // PLAY STATE
            // -------------------------------------------------------
            case GameDefs.gameStates.PLAY:
                try 
                {
                    // GAme clock that helps update when NPC's speed should incread and give player points
                    const gameClock = game.gameTimers.getObjectByName(GameDefs.timerTypes.GAME_CLOCK);

                    const board = game.billBoards.getObjectByName(GameDefs.billBoardTypes.BACKGROUND.type);

                    board.update(delta, game)

                    if (gameClock.active)
                    {
                        // Update game time clock
                        gameClock.update(delta);
                    }

                    game.player.update(device, game, delta);
                    checkforPause(device, game);                    
                } 
                catch (e) 
                {
                    console.error("PLAY state error:", e);
                }
                break;

            // -------------------------------------------------------
            // PAUSE STATE
            // -------------------------------------------------------
            case GameDefs.gameStates.PAUSE:
                try 
                {
                    // while in pause mode if player un-pauses
                    if (device.keys.isKeyPressed(GameDefs.keyTypes.PAUSE_KEY_L)) 
                    {
                        // Update states
                        game.setGameState(GameDefs.gameStates.PLAY);

                    }
                    // Dev hack if you want to restart game quickly
                    if (device.keys.isKeyDown(GameDefs.keyTypes.RESET_KEY)) 
                    {
                        game.setGameState(GameDefs.gameStates.INIT);
                    }
                }
                catch (e) 
                {
                    console.error("PAUSE state error:", e);
                }
                break;

            // -------------------------------------------------------
            // WIN STATE - currently not in use
            // -------------------------------------------------------
            case GameDefs.gameStates.WIN:
                try 
                {
                    // Check for game restart and Init game if it happens  
                    if (device.keys.isKeyDown(GameDefs.keyTypes.RESET_KEY)) 
                    {
                        game.setGameState(GameDefs.gameStates.INIT);
                    }
                } 
                catch (e) 
                {
                    console.error("WIN state error:", e);
                }
                break;

            // -------------------------------------------------------
            // LOSE STATE
            // -------------------------------------------------------
            case GameDefs.gameStates.LOSE:
                try 
                {
                    if (device.keys.isKeyDown(GameDefs.keyTypes.RESET_KEY)) 
                    {
                        game.setGameState(GameDefs.gameStates.INIT);
                    }
                } 
                catch (e) 
                {
                    console.error("LOSE state error:", e);
                }
                break;

            default:
                console.warn("Unknown game state:", game.gameState);
                break;
        }
    } 
    catch (e) 
    {
        console.error("updateGameStates main error:", e);
    }
}

// Used during play state wating for player to hit pause button
function checkforPause(device, game)  
{     
    try 
    {
        if (device.keys.isKeyPressed(GameDefs.keyTypes.PAUSE_KEY_L)) 
        {
            if (game.gameState === GameDefs.gameStates.PLAY )   
            {
                // Switch to pause mode
                game.setGameState(GameDefs.gameStates.PAUSE);
            }
            else if (game.gameState === GameDefs.gameStates.PAUSE) 
            {
                // Resume play mode
                game.setGameState(GameDefs.gameStates.PLAY);
            }
        }
    } 
    catch (e) 
    {
        console.error("checkforPause error:", e);
    }
}  
