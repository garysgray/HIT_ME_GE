// ============================================================================
// gameUtilities.js
// ----------------------------------------------------------------------------
// Utility classes for the core game engine (rendering, input, audio, timing)
// Does NOT contain game logic itself — these classes are tools for Controller
// and Game objects.
//
// Classes:
// - Device: Manages canvas, rendering, input tools (mouse/keyboard)
// - ObjHolder: Container for objects with optional ordering
// - Sprite: Image wrapper with name, load state, optional width/height
// - AudioPlayer & Sound: Audio management
// - Timer: Countdown/Countup timer

// These helpers provide a consistent and reusable foundation for rendering, input, audio, and timing,
// so that the game controller can focus on high-level game logic.

// ============================================================================


// ============================================================================
// Device Class (Testable & Runtime Ready)
// ============================================================================

class Device {
    #canvas;
    #ctx;
    #mouseDown;
    #images;
    #audio;
    #keys;

    constructor(width, height, canvasEl = null) 
    {
        try
        {
            // Use passed canvas element or fallback to document.getElementById
            this.#canvas = canvasEl || document.getElementById("canvas");

            if (!this.#canvas) 
            {
                console.warn("Canvas element not found; using dummy canvas for test.");
                // dummy canvas for testing
                this.#canvas = { width, height, getContext: () => ({ 
                    drawImage: () => {}, fillText: () => {}, measureText: () => ({ width: 0 }), 
                    save: () => {}, restore: () => {}, strokeRect: () => {}, fillRect: () => {} 
                })};
            }

            this.#ctx = this.#canvas.getContext("2d") || {};
            this.#canvas.width = width;
            this.#canvas.height = height;

            this.#mouseDown = false;
            this.#images = (typeof ObjHolder !== "undefined") ? new ObjHolder() : { addObject: () => {} };
            this.#audio = (typeof AudioPlayer !== "undefined") ? new AudioPlayer() : { addSound: () => {} };
            this.#keys = (typeof KeyManager !== "undefined") ? new KeyManager() : { clearFrameKeys: () => {} };

        } 
        catch (err) 
        {
            console.error("Device initialization failed:", err.message);
            throw err;
        }
    }

    // -----------------------------
    // Getters
    // -----------------------------
    get canvas() { return this.#canvas; }
    get ctx() { return this.#ctx; }
    get mouseDown() { return this.#mouseDown; }
    get images() { return this.#images; }
    get audio() { return this.#audio; }
    get keys() { return this.#keys; }

    // -----------------------------
    // Setter
    // -----------------------------
    set mouseDown(newState) { this.#mouseDown = newState; }

    // -----------------------------
    // Mouse setup
    // -----------------------------
   setupMouse(sprite, aDev) 
   {
        if (!sprite || !this.#canvas) return;

        try 
        {
            window.addEventListener("mousedown", () => this.#mouseDown = true);
            window.addEventListener("mouseup", () => this.#mouseDown = false);
            window.addEventListener("mousemove", (e) => {
                const rect = this.#canvas.getBoundingClientRect();
                sprite.posX = e.clientX - rect.left;
                sprite.posY = e.clientY - rect.top;
            });
        } 
        catch (err) 
        {
            console.warn("Failed to setup mouse events:", err.message);
        }
    }

    renderImage(aImageOrSprite, aX = 0, aY = 0, w, h) 
    {
        try 
        {
            if (!aImageOrSprite) return;
            const img = aImageOrSprite.image ?? aImageOrSprite;
            if (typeof w === "number" && typeof h === "number") {
                this.#ctx.drawImage(img, aX, aY, w, h);
            } else {
                this.#ctx.drawImage(img, aX, aY);
            }
        } 
        catch (err) 
        {
            console.warn("renderImage failed:", err.message);
        }
    }

    renderClip(aClip, aPosX, aPosY, aWidth, aHeight, aState = 0) 
    {
        try 
        {
            this.#ctx.drawImage(
                aClip,
                aState * aWidth,
                0,
                aWidth,
                aHeight,
                aPosX - aWidth * 0.5,
                aPosY - aHeight * 0.5,
                aWidth,
                aHeight
            );
        } 
        catch (err) 
        {
            console.warn("renderClip failed:", err.message);
        }
    }
    
    centerImage(aImage, aPosX, aPosY) 
    {
        try 
        {
            const img = aImage.image ?? aImage;
            if (!img) return;
            this.#ctx.drawImage(img, aPosX - img.width * 0.5, aPosY - img.height * 0.5);
        }
         catch (err) 
        {
            console.warn("centerImage failed:", err.message);
        }
    }

    putText(aString, x, y) 
    {
        try { this.#ctx.fillText(aString, x, y); } 
        catch { /* ignore */ }
    }

    centerTextOnY(text, posY) 
    {
        try 
        {
            const textWidth = this.#ctx.measureText(text).width;
            const centerX = (this.#canvas.width - textWidth) * 0.5;
            this.#ctx.fillText(text, centerX, posY);
        } 
        catch 
        { /* ignore */ }
    }

    colorText(color) 
    {
        try { this.#ctx.fillStyle = color.toString(); } 
        catch { /* ignore */ }
    }

    setFont(font) 
    {
        try { this.#ctx.font = font.toString(); } 
        catch { /* ignore */ }
    }

    debugText(text, posX, posY, color = "white") 
    {
        try 
        {
            this.setFont("24px Arial Black");
            this.colorText(color);
            this.putText(text.toString() ?? "", posX, posY);
        } 
        catch
        { /* ignore */ }
    }
}

class ObjHolder 
{
	#objects;       // main container
    #orderedList;   // keeps objects in order

    constructor() 
	{
        this.#objects = [];        // main container
        this.#orderedList = [];    // keeps objects in a specific order if needed
    }

    // --- Add / remove objects ---
    addObject(obj, addToOrder = true)
	{
        this.#objects.push(obj);
        if (addToOrder) this.#orderedList.push(obj);
    }

    subObject(index) 
    {
        try 
        {
            const obj = this.#objects[index];
            if (!obj) return;
            this.#objects.splice(index, 1);
            const i = this.#orderedList.indexOf(obj);
            if (i >= 0) this.#orderedList.splice(i, 1);
        } 
        catch (err)
        { 
            console.warn("subObject failed:", err.message); 
        }
    }

    clearObjects() { this.#objects = []; this.#orderedList = []; }
    getIndex(index) { return this.#objects[index]; }
    getSize() { return this.#objects.length; }

    getObjectByName(name) { return this.#objects.find(o => o.name === name); }
    getImage(name) { return this.getObjectByName(name).image ?? null; }

    setOrder(newOrderArray) 
    {
        if (!Array.isArray(newOrderArray)) return;
        this.#orderedList = newOrderArray.filter(o => this.#objects.includes(o));
    }

    forEach(cb) 
    { 
        if (typeof cb === "function") this.#objects.forEach(cb); 
    }
}

class KeyManager 
{
	#keysDown;       // currently held keys
    #keysPressed;    // keys pressed this frame
    #keysReleased;   // keys released this frame

	constructor() 
	{
        this.#keysDown = {};       // currently held keys
        this.#keysPressed = {};    // pressed this frame
        this.#keysReleased = {};   // released this frame

        this.initKeys();
    }

    initKeys() 
    {
        try 
        {
            window.addEventListener("keydown", e => {
                if (!this.#keysDown[e.code]) this.#keysPressed[e.code] = true;
                this.#keysDown[e.code] = true;
            });
            window.addEventListener("keyup", e => {
                delete this.#keysDown[e.code];
                this.#keysReleased[e.code] = true;
            });
        } catch (err) { console.warn("KeyManager init failed:", err.message); }
    }

    // --- Query methods ---
    isKeyDown(key) { return !!this.#keysDown[key]; }
    isKeyPressed(key) { return !!this.#keysPressed[key]; }
    isKeyReleased(key) { return !!this.#keysReleased[key]; }
    clearFrameKeys() { this.#keysPressed = {}; this.#keysReleased = {}; }

}

class Sound
{
    #name;
    #volume
    #src;
    #pool;
    #index;
    #poolSize;

    constructor(name, src, poolSize, volume)
    {
        this.#name = name;
        this.#src = src;
        this.#volume = volume;
        this.#pool = [];
        this.#index = 0;
        this.#poolSize = Math.max(1, poolSize); // never <1
     

        // preload audio pool
        try 
        {
            for (let i = 0; i < this.#poolSize; i++) 
            {
                const audio = new Audio(this.#src);
                audio.preload = "auto";
                audio.volume = this.#volume;
                this.#pool.push(audio);
            }
        } 
        catch (err) 
        { 
            console.warn("Sound pool creation failed:", name, err.message); 
        }
    }

    get name() { return this.#name; }
    
    play() 
    {
        try 
        {
            let audio = this.#pool[this.#index];
            if (!audio.paused) audio = audio.cloneNode(true);
            audio.volume = this.#volume;
            audio.currentTime = 0;
            audio.play();
            this.#index = (this.#index + 1) % this.#poolSize;
        } 
        catch {}
    }

    stopAll() 
    { 
        this.#pool.forEach(a => { try { a.pause(); a.currentTime = 0; } catch {} }); 
    }
}

class AudioPlayer
 {
    #sounds;

    constructor()
    {
        this.#sounds = new ObjHolder();
    }

    addSound(name, src, poolSize = 1, volume = 1) 
    {
        try { if (!name || !src) return; this.#sounds.addObject(new Sound(name, src, poolSize, volume)); } catch {}
    }

    getSound(name) 
    {
        return this.#sounds.getObjectByName(name);
    }

    playSound(name) 
    {
        const sound = this.getSound(name);
        if (!sound) {
            console.warn(`Sound "${name}" not found`);
            return;
        }

        try {
            sound.play();
        } 
        catch (e) 
        {
            console.error(`Failed to play sound "${name}":`, e);
        }
    }

    stopSound(name) 
    {
        const sound = this.getSound(name);
        if (sound) {
            try 
            {
                sound.stopAll();
            } 
            catch (e) 
            {
                console.error(`Failed to stop sound "${name}":`, e);
            }
        }
    }

    stopAll() 
    {
        this.#sounds.forEach(sound => {
            try 
            {
                sound.stopAll();
            } 
            catch (e) 
            {
                console.error(`Failed to stop a sound:`, e);
            }
        });
    }

    hasSound(name) { return !!this.getSound(name); }
 }

class Sprite
 {
    #image;
    #name;
	#loaded;
    #posX = 0;   // current X position
    #posY = 0;   // current Y position

    constructor(src, name, x = 0, y = 0, width = null, height = null) 
	{
        
   
        this.#name = name;
		this.#loaded = false;
        this.#posX = x;
        this.#posY = y;

        try
        {
            this.#image = new Image();
            if(!this.#image) throw new Error("Image did not load");
            if (!src) throw new Error("Sprite source missing");
            this.#image.src = src;
            if (width) this.#image.width = width;
            if (height) this.#image.height = height;
            this.#image.onload = () => this.#loaded = true;
        }
        catch (err)
        {
             console.warn("Sprite init failed:", err.message); 
        }
    }

    // --- Getters ---
    get name() { return this.#name; }
    get image() { return this.#image; }
    get width() { return this.#image.width; }
    get height() { return this.#image.height; }
    get loaded() { return this.#loaded; }
    get posX() { return this.#posX; }
    get posY() { return this.#posY; }

    // --- Position helpers ---
    set posX(value) { this.#posX = value; }
    set posY(value) { this.#posY = value; }
}

class Timer
{
    #name
    #duration;     // seconds for one cycle
    #timeLeft;     // countdown mode: seconds remaining
    #elapsedTime;  // countup mode: seconds elapsed
    #active;       // is the timer running?
    #mode;         // GameDefs.timerModes.COUNTDOWN or COUNTUP
    #loop;         // true = auto restart after finish

    constructor(name, durationSeconds = 0, mode = GameDefs.timerModes.COUNTDOWN, loop = false) 
    {
        this.#name = name;
        this.#duration = durationSeconds;
        this.#timeLeft = durationSeconds;
        this.#elapsedTime = 0;
        this.#active = false;
        this.#mode = mode;
        this.#loop = loop;
    }

    // --- Getters ---
    get name() { return this.#name; }
    get active() { return this.#active; }
    get timeLeft() { return Math.max(0, this.#timeLeft); }
    get elapsedTime() { return this.#elapsedTime; }
    get progress() {
        return this.#mode === GameDefs.timerModes.COUNTDOWN
            ? 1 - (this.#timeLeft / (this.#duration || 1))
            : (this.#duration ? Math.min(1, this.#elapsedTime / this.#duration) : 0);
    }

    // --- Control ---
    start() 
    {
        if (this.#mode === GameDefs.timerModes.COUNTDOWN) 
        {
            this.#timeLeft = this.#duration;
        } 
        else 
        {
            this.#elapsedTime = 0;
        }
        this.#active = true;
    }

    stop() 
    {
        this.#active = false;
    }

    // reset now explicitly sets duration, mode, and loop
    reset(durationSeconds = this.#duration, mode = this.#mode, loop = this.#loop) 
    {
        this.#duration = durationSeconds;
        this.#mode = mode;
        this.#loop = loop;
        this.start();
    }

    // update returns true on a "tick/finish" moment
    update(delta) 
    {
        if (!this.#active) return false;

        if (this.#mode === GameDefs.timerModes.COUNTDOWN) 
        {
            this.#timeLeft -= delta;
            if (this.#timeLeft <= 0) {
                if (this.#loop) 
                {
                    // restart but preserve slight overflow
                    this.#timeLeft += this.#duration;
                } else {
                    this.#active = false;
                }
                return true;
            }
        } 
        else 
        { // COUNTUP
            this.#elapsedTime += delta;
            if (this.#loop && this.#duration > 0 && this.#elapsedTime >= this.#duration) 
            {
                this.#elapsedTime -= this.#duration;
                return true;
            }
        }
        return false;
    }

    // Formatted MM:SS
    get formatted() 
    {
        const total = Math.floor(this.elapsedTime);
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
}

// Draw a rectangle around an object's hitbox (uses object's getHitbox())
function drawHitbox(device, obj, options = {}) 
{
    try 
    {
        const color = options.color || 'magenta';
        const lineWidth = options.lineWidth ?? 1;
        const fill = options.fill || false;
        const alpha = options.alpha ?? 1.0;

        if (typeof obj.getHitbox !== 'function') return; // safety

        const hb = obj.getHitbox(options.scale ?? 1.0, options.buffer ?? 0);
        const w = hb.right - hb.left;
        const h = hb.bottom - hb.top;
        const ctx = device.ctx;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        if (fill) 
        {
            ctx.fillStyle = color;
            ctx.fillRect(hb.left, hb.top, w, h);
        } 
        else 
        {
            ctx.strokeRect(hb.left, hb.top, w, h);
        }
        ctx.restore();
    }  
    catch (err) 
    { 
        console.warn("drawHitbox failed:", err.message); 
    }
}
