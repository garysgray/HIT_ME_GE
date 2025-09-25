// ============================================================================
// npcLogic.js
// -----------------------------------------------------------------------------
// Core update logic for NPCs and collisions.
// Called every frame from controller.js update loop.
// -----------------------------------------------------------------------------
// ============================================================================

// -----------------------------------------------------------------------------
// NPC UPDATES
/**
 * Spawns and updates NPC sprites:
 * - Orbs (common).
 * - FireAmmo (rare).
 * Ensures no overlapping spawns and removes off-screen or dead NPCs.
 */
// -----------------------------------------------------------------------------

// Calls to spawns and update Enemy Orbs and Gunfire ammo while in play mode
function updateNPCSprites(device, game, delta)  
{     
    try 
    {
        if (!game.gameSprites) return;

        // Spawn ORBS
        try 
        { 
            spawnNPC(device, game, GameDefs.spriteTypes.ORB.type, GameDefs.spriteTypes.ORB.w, GameDefs.spriteTypes.ORB.h, GameDefs.spriteTypes.ORB.speed, 1 / GameDefs.spriteTypes.ORB.spawnRatio ); 
        } 
        catch (e) 
        {
             console.error("ORB spawn error:", e); 
        }

        // Spawn Fire Ammo
        try 
        { 
            spawnNPC(device, game, GameDefs.spriteTypes.FIRE_AMMO.type, GameDefs.spriteTypes.FIRE_AMMO.w, GameDefs.spriteTypes.FIRE_AMMO.h, GameDefs.spriteTypes.FIRE_AMMO.speed, 1 / GameDefs.spriteTypes.FIRE_AMMO.spawnRatio ); 
        } 
        catch (e) 
        { 
            console.error("FireAmmo spawn error:", e); 
        }

        // Update NPC movement
        for (let i = game.gameSprites.getSize() - 1; i >= 0; i--) 
            {
            const npc = game.gameSprites.getIndex(i);
            if (!npc) continue;

            try 
            { 
                npc.update(device, game, delta); 
            } 
            catch (e) 
            { 
                console.error("NPC update error:", e); 
            }

            // If NPC is dead remove from game
            const offscreen = npc.posY > (device.canvas.height);
            if (!npc.alive || offscreen) 
            {
                try 
                { 
                    game.gameSprites.subObject(i); } catch (e) { console.error("Failed to remove NPC:", e);    
                }
            }
        }
    } 
    catch (e) 
    {
        console.error("updateNPCSprites error:", e);
    }
}  

// Function that spawns NPC's, and moves them to a random x pos and then calls attempts at keeping these NPC's from spawning/moving positons on top of each other
function spawnNPC(device, game, type, width, height, speed, chance)
{
    try 
    {
        if (!type || Math.random() >= chance) return;

        const npc = new NPC(type, width, height, 0, 0, speed);

        // Position vars
        const minX = npc.halfWidth;
        const maxX = device.canvas.width - npc.halfWidth;
        const startY = npc.halfHeight + device.canvas.height * game.gameConsts.HUD_BUFFER;

        // how many attempts at not spawing on top of another npc
        const attemptsMax = game.gameConsts.SPAWN_ATTEMPTS;

        // Moves to a position with random x pos
        npc.movePos(minX + Math.random() * (maxX - minX), startY);

        let attempts = 0;
        while (attempts < attemptsMax && overlapsAny(npc, game.gameSprites))
        {
            npc.movePos(minX + Math.random() * (maxX - minX), startY);
            attempts++;
        }

        game.gameSprites.addObject(npc);
    } 
    catch (e) 
    {
        console.error("spawnNPC error:", e);
    }
}

// helper: does npc overlap any existing alive sprites
// using gameObjects self getHitbox function to check for overlap
function overlapsAny(npc, holder) 
{
    try 
    {
        const count = holder.getSize();
        const npcBox = npc.getHitbox(1.0, 0); 

        for (let i = 0; i < count; i++) 
        {
            const other = holder.getIndex(i);
            const otherBox = other.getHitbox(1.0, 0);

            if (otherBox && rectsCollide(npcBox, otherBox)) return true;
        }
    } 
    catch (e) 
    {
        console.error("overlapsAny error:", e);
    }
    return false;
}

// -----------------------------------------------------------------------------
// COLLISION
// -----------------------------------------------------------------------------

/**-----------------------------------------------------------------------------
 * Checks player collisions with NPCs:
 * - fireAmmo → gives ammo, switches to SHOOT state.
 * - orb/others → causes damage, reduces life, sets DEATH/LOSE state.
 *///-----------------------------------------------------------------------------

function check_NPC_Collision(device, game)  
{    
    try 
    {
        const player = game.player;
        const spritesCount = game.gameSprites.getSize();

        for (let i = spritesCount - 1; i >= 0; i--) 
        {
            const npc = game.gameSprites.getIndex(i);

            // If we are not close enough then move on to next sprite
            if (!roughNear(player, npc)) continue;

            // We hit the NPC
            npc.kill();

            // Depending on the NPC (enemy orb, fire ammo) type we have dif actions
            if (npc.name === GameDefs.spriteTypes.FIRE_AMMO.type) 
            {    
               try 
                {
                    device.audio.playSound(GameDefs.soundTypes.GET.name);
                } 
                catch(e) 
                {
                    console.warn("Could not play get sound:", e);
                }
                
                game.playState = GameDefs.playStates.SHOOT;
                game.increaseAmmo(game.gameConsts.AMMO_AMOUNT);
            } 
            else 
            {  
                try 
                {
                    device.audio.playSound(GameDefs.soundTypes.HURT.name);
                } 
                catch(e) 
                {
                    console.warn("Could not play hurt sound:", e);
                }

                // Transition to lose state as before
                // Tell the GAME that the playstates is Death
                game.playState = GameDefs.playStates.DEATH;
                game.gameState = GameDefs.gameStates.LOSE;

                if (game.player) 
                {
                    // Tell the PLAYER state that the playstates is Death
                    game.player.state = GameDefs.playStates.DEATH; // force visual state immediately   
                }

                game.decreaseLives(1);

                return false;
            }
        }
    } 
    catch (e) 
    {
        console.error("check_NPC_Collision error:", e);
    }
    return true;
} 
