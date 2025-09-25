// ============================================================================
// projectileLogic.js
// -----------------------------------------------------------------------------
// Core update logic for projectiles, and collisions.
// Called every frame from controller.js update loop.
// -----------------------------------------------------------------------------
// PROJECTILE UPDATES
// Moves each projectile via its own update().
// Removes projectiles when off-screen or marked dead.
// Runs centralized collision check against NPCs.
// ============================================================================

function updateProjectiles(device, game, delta)  
{     
    try 
    {
        for (let i = game.projectiles.getSize() - 1; i >= 0; i--) 
        {
            const proj = game.projectiles.getIndex(i);
            try 
            { 
                proj.update(device, game, delta); 
            } 
            catch (e) 
            { 
                console.error("Projectile update error:", e); 
            }
            
            const offscreen = proj.posY + proj.halfHeight < game.gameConsts.SCREEN_HEIGHT * game.gameConsts.HUD_BUFFER;
            const dead = proj.alive === false;

            if (offscreen || dead)
            {
                try
                { 
                    game.projectiles.subObject(i); 
                } 
                catch (e) 
                { 
                    console.error("Failed to remove projectile:", e); 
                }
            }
        }

        updateProjectilesCollision(device, game, delta);
    } 
    catch (e) 
    {
        console.error("updateProjectiles error:", e);
    }
}  

// -----------------------------------------------------------------------------
// COLLISION
// -----------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * Checks projectile collisions with NPCs:
 * - Removes both projectile and NPC on hit.
 * - Plays "hit" sound effect.
 * - Increases score.
 */
// -----------------------------------------------------------------------------
function updateProjectilesCollision(device, game)  
{   
    try 
    {
        const spritesCount = game.gameSprites.getSize();
        const projsCount = game.projectiles.getSize();

        for (let i = projsCount - 1; i >= 0; i--) 
        {
            const proj = game.projectiles.getIndex(i);
            const projBox = proj.getHitbox(1.0, 0);     

            for (let j = spritesCount - 1; j >= 0; j--) 
            {
                const npc = game.gameSprites.getIndex(j);
                const npcBox = npc.getHitbox(1.0, 0);  

                // If they hit, then a sound will be generated, player score increased, bullet and NPC should be killed and removed from game
                if (rectsCollide(projBox, npcBox)) 
                {
                    try { device.audio.playSound(GameDefs.soundTypes.HIT.name); } catch (e) { console.warn("Failed to play hit sound:", e); }
                    try { game.increaseScore(game.gameConsts.SCORE_INCREASE); } catch (e) { console.warn("Failed to increase score:", e); }

                    npc.kill();
                    proj.kill();
                    break;
                }
            }
        }
    }
    catch (e)
    {
        console.error("updateProjectilesCollision error:", e);
    }
}   

