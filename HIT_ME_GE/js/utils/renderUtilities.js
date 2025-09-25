//***************************************************************
// Rendering Functions for Game Objects
//***************************************************************
// These helper functions are called inside renderGameObjectsLayer
// (which is wrapped in a Layer and managed by controller.js).
// Each function is responsible for rendering a specific type of
// object in the game: NPC sprites, projectiles, and the player.
//***************************************************************

//---------------------------------------------------------------
// Render NPC Sprites (orbs, fireAmmo, etc.)
//---------------------------------------------------------------
function renderNPCSprites(device, game) 
{
    try
    {
        // Preload references to images (avoid repeated lookups each frame)
        const orbImage      = device.images.getImage(GameDefs.spriteTypes.ORB.type);
        const fireAmmoImage = device.images.getImage(GameDefs.spriteTypes.FIRE_AMMO.type);

        for (let i = 0; i < game.gameSprites.getSize(); i++) 
        {
            const tempObj = game.gameSprites.getIndex?.(i);
            if (!tempObj) continue;

            switch(tempObj.name) 
            {
                case GameDefs.spriteTypes.ORB.type:
                    if (orbImage) device.centerImage(orbImage, tempObj.posX, tempObj.posY);
                    else console.warn("ORB image missing.");
                break;

                case GameDefs.spriteTypes.FIRE_AMMO.type:
                    if (fireAmmoImage) device.centerImage(fireAmmoImage, tempObj.posX, tempObj.posY);
                    else console.warn("FIRE_AMMO image missing.");
                break;

                default:
                    console.warn("Unknown NPC type:", tempObj.name);
            }

            if (DRAW_DEBUG_HITBOXES && tempObj) drawHitBoxs(device, tempObj);
        }

    } catch (e) {
        console.error("Error in renderNPCSprites:", e);
    }
}

//---------------------------------------------------------------
// Render Bullets (projectiles)
//---------------------------------------------------------------
function renderProjectiles(device, game) 
{
    try 
    {
        const bulletImage = device.images.getImage?.(GameDefs.spriteTypes.BULLET.type);
        if (!bulletImage) console.warn("Bullet image missing.");

        for (let i = 0; i < game.projectiles.getSize(); i++) 
        {
            const tempObj = game.projectiles.getIndex?.(i);
            if (!tempObj) continue;

            if (bulletImage) device.centerImage(bulletImage, tempObj.posX, tempObj.posY);
            if (DRAW_DEBUG_HITBOXES) drawHitBoxs(device, tempObj);
        }

    } catch (e) {
        console.error("Error in renderProjectiles:", e);
    }
}

//---------------------------------------------------------------
// Render Player (different clips based on playState)
//---------------------------------------------------------------
function renderPlayer(device, game) 
{
    try 
    {
        const tempObj = game.player;
        
        const playerImage = device.images.getImage(GameDefs.spriteTypes.PLAYER.type);
        if (!playerImage) 
        {
            console.warn("Player image missing.");
        }

         // Always draw according to the internal state
        device.renderClip(
            playerImage,
            tempObj.posX,
            tempObj.posY,
            tempObj.width,
            tempObj.height,
            tempObj.state
        );
        
        if (DRAW_DEBUG_HITBOXES) drawHitBoxs(device, tempObj);

    } 
    catch (e)
    {
        console.error("Error in renderPlayer:", e);
    }
}

//---------------------------------------------------------------
// Render HITBOXES if DRAW_DEBUG_HITBOXES == true
//---------------------------------------------------------------
function drawHitBoxs(device, tempObj) 
{
    try 
    {
        const x = tempObj.posX - tempObj.halfWidth;
        const y = tempObj.posY - tempObj.halfHeight;
        const w = tempObj.width;
        const h = tempObj.height;

        device.ctx.strokeStyle = "lime";
        device.ctx.strokeRect(x, y, w, h);
    } 
    catch (e)
    {
        console.error("Error in drawHitBoxs:", e);
    }
}
