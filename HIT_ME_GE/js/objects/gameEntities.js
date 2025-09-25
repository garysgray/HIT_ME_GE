// ============================================================================
// Base GameObject + Child Classes (Player, Projectile, NPC, BackDrop)
// ============================================================================
// --------------------------------------------
// GameObject is the base class for all in-game entities
// - Tracks position, size, speed, and state
// - Provides movement and collision functions
//
// Projectile extends GameObject
// - Moves upward each frame until offscreen
// - Has alive flag for cleanup
//
// NPC extends GameObject
// - Moves downward each frame until offscreen
// - Has alive flag for cleanup
//
// BackDrop extends GameObject
// - Used for static/scrolling backgrounds or decorative elements
// --------------------------------------------

class GameObject 
{
    #name;
    #width;
    #height;
    #posX;
    #posY;
    #speed;
    #state;
    #alive = true;

    #halfWidth; #halfHeight;

    #holdPosX = 0;
    #holdPosY = 0;

    constructor(name, width, height, posX, posY, speed) 
    {
        try
        {
            this.#name = name;
            this.#width = width;
            this.#height = height;
            this.#posX = posX;
            this.#posY = posY;
            this.#speed = speed;
            this.#state = 0;

            this.#halfWidth = width * 0.5;
            this.#halfHeight = height * 0.5;
        } 
        catch (e) 
        {
            console.error("GameObject constructor error:", e);
        }
    }

    // ---- Getters ----
    get name() { return this.#name; }
    get width() { return this.#width; }
    get height() { return this.#height; }
    get posX() { return this.#posX; }
    get posY() { return this.#posY; }
    get speed() { return this.#speed; }

    get state() { return this.#state; }
    get alive() { return this.#alive; }

    get halfWidth() { return this.#halfWidth; }
    get halfHeight() { return this.#halfHeight; }

    get holdPosX() { return this.#holdPosX; }
    get holdPosY() { return this.#holdPosY; }

    // ---- Setters ----
    set name(v) { this.#name = v; }
    set width(v) { this.#width = v; }
    set height(v) { this.#height = v; }
    set posX(v) { this.#posX = v; }
    set posY(v) { this.#posY = v; }
    set speed(v) { this.#speed = v; }

    set state(v) { this.#state = v; }
    set alive(v) { this.#alive = Boolean(v); }

    set holdPosX(v) { this.#holdPosX = v; }
    set holdPosY(v) { this.#holdPosY = v; }

    kill() { this.#alive = false; }

    // ---- Core Methods ----
    // Placeholder update (to be overridden by child classes if needed)
    update(device, delta) {}

    // Move object down based on its speed
    moveDown(delta) 
    {
        try
         {
            this.#posY += this.#speed * delta;
        } 
        catch (e) 
        {
            console.error(`moveDown error for ${this.#name}:`, e);
        }
    }

    movePos(newX, newY) 
    {
        try 
        {
            this.#posX = newX;
            this.#posY = newY;
        } 
        catch (e) 
        {
            console.error(`movePos error for ${this.#name}:`, e);
        }
    }

    // Save player position so it can be restored on resume
    savePos(x, y)
    {
         this.#holdPosX = x;             
         this.#holdPosY = y;             
    }

    restoreSavedPos()
    {
         this.#posX =  this.#holdPosX; 
         this.#posY =  this.#holdPosY ;
    }

    // Return an axis-aligned hitbox for this object.
    // scale lets you make the box a bit smaller (e.g., 0.9 for friendlier hits).
    // buffer shrinks it further by pixels on each side.
    // Both are clamped so they can’t go negative.
    getHitbox(scale = 1.0, buffer = 0) 
    {
        try 
        {
            const hw = Math.max(0, this.#halfWidth * scale - buffer);
            const hh = Math.max(0, this.#halfHeight * scale - buffer);
            return {
                left: this.#posX - hw,
                right: this.#posX + hw,
                top: this.#posY - hh,
                bottom: this.#posY + hh
            };
        } 
        catch (e) 
        {
            console.error(`getHitbox error for ${this.#name}:`, e);
            return { left: 0, right: 0, top: 0, bottom: 0 };
        }
    }

    getRoughRadius() 
    {
        return Math.max(this.#halfWidth, this.#halfHeight);
    }
}

// --------------------------------------------
// Projectile
// --------------------------------------------
// Fired by the player (or NPCs in the future)
// - Moves upward each frame
// - Becomes inactive if offscreen
// --------------------------------------------
class Projectile extends GameObject 
{
    constructor(name, width, height, posX, posY, speed) {
        super(name, width, height, posX, posY, speed);
    }

    update(device, game, delta) 
    {
        try 
        {
            this.posY -= this.speed * delta;
            if (this.posY + this.halfHeight < 0) this.kill();
        } 
        catch (e) 
        {
            console.error("Projectile update error:", e);
        }
    }
}

// --------------------------------------------
// NPC (Enemy/Obstacle)
// --------------------------------------------
// Moves downward from top of screen
// Dies if it leaves the play area
// --------------------------------------------
class NPC extends GameObject 
{
    constructor(name, width, height, x, y, speed) 
    {
        super(name, width, height, x, y, speed);
    }

    update(device, game, delta) 
    {
        try 
        {
            const hud_buff = game.gameConsts.HUD_BUFFER  * game.gameConsts.SCREEN_HEIGHT;
            this.moveDown(game, delta);
            if (this.posY > game.gameConsts.SCREEN_HEIGHT  + hud_buff) this.kill();
        } 
        catch (e) 
        {
            console.error("NPC update error:", e);
        }
    }

    moveDown(game, delta) 
    {
        try 
        {
            if (game.npcSpeedMuliplyer > 0)
            {
                this.posY += (this.speed * game.npcSpeedMuliplyer)  * delta;
            }
            else
            {
                this.posY += this.speed  * delta;
            }
            
        } 
        catch (e) 
        {
            console.error(`moveDown error for ${this.name}:`, e);
        }
    }

}

// --------------------------------------------
// BillBoard
// --------------------------------------------
// Static or decorative background object
// Currently does nothing, but could support parallax or animation
// --------------------------------------------
class BillBoard extends GameObject 
{
    #isCenter = true;

    constructor(name, width, height, x, y, speed, isCenter = true) 
    {
        super(name, width, height, x, y, speed);

        this.#isCenter = isCenter;
    }

    get isCenter() { return this.#isCenter; }

    centerObjectInWorld(screenW, screenH) 
    {
        if (this.#isCenter)
        {
            try 
            {
                this.posX = (screenW - this.width) * 0.5;
                this.posY = (screenH - this.height) * 0.5;
            } 
            catch (e) 
            {
                console.error("BillBoard centerObjectInWorld error:", e);
            }
        }
        
    }
    update(device, delta) 
    {
        // Optional: BillBoard scrolling/animation
    }
}
