// ============================================================================
// deviceSpec.js
// ============================================================================

describe("Device Object", function() {
    let device;

    beforeEach(function() {
        // Create device with a dummy canvas for test safety
        const dummyCanvas = document.createElement("canvas");
        document.body.appendChild(dummyCanvas); // optional, just to satisfy querySelector
        device = new Device(800, 600, dummyCanvas);
    });

    afterEach(function() {
        // Clean up dummy canvas
        if (device.canvas && device.canvas.parentNode) {
            device.canvas.parentNode.removeChild(device.canvas);
        }
        device = null;
    });

    it("should initialize Device as an object", function() {
        expect(device).toBeDefined();
    });

    it("should have a canvas element with correct size", function() {
        expect(device.canvas).toBeDefined();
        expect(device.canvas.width).toBe(800);
        expect(device.canvas.height).toBe(600);
    });

    it("should have a 2D context", function() {
        expect(device.ctx).toBeDefined();
        expect(typeof device.ctx.drawImage).toBe("function");
    });

    it("should initialize mouseDown as false", function() {
        expect(device.mouseDown).toBe(false);
    });

    it("should have images, audio, and keys objects", function() {
        expect(device.images).toBeDefined();
        expect(device.audio).toBeDefined();
        expect(device.keys).toBeDefined();
    });

    it("should allow setting mouseDown", function() {
        device.mouseDown = true;
        expect(device.mouseDown).toBe(true);
    });

    it("setupMouse should not throw when called", function() {
        const sprite = { posX: 0, posY: 0 };
        expect(function() { device.setupMouse(sprite); }).not.toThrow();
    });
});
