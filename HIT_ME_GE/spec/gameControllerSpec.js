describe("Controller Object", function() 
{
    let controller;

    beforeEach(function() 
    { 
        controller = new Controller();
    });

    it("should initialize controller as an object", function()
    {
        expect(controller).toBeDefined();
    });

    it("should initialize device as a Device instance", function () 
    {
        expect(controller.device).toEqual(jasmine.any(Device));
    });

    it("should initialize game as a game instance", function () 
    {
        expect(controller.game).toEqual(jasmine.any(Game));
    });
});

















