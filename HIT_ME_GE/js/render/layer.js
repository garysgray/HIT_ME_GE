// ============================================================================
// Layer Class
// ----------------------------------------------------------------------------
// A layer is used to organize rendering in the game.  
// Each layer has a name (for identification) and a render function that draws content.  
// The main game loop can call each layer in order, giving structure to rendering.
// ============================================================================

class Layer
{
    // Constructor sets the name of the layer and the rendering function to call
    constructor(name, renderFn) 
    {
        this.name = name;       // String identifier for this layer
        this.renderFn = renderFn; // Function used to render the layer’s content
    }

    // Render method calls the assigned render function for this layer
    // Passes in the device (canvas/audio/inputs), game state, and delta time
    render(dev, game, delta) 
    {
        try 
        {
            this.renderFn(dev, game, delta);
        } 
        catch (e) 
        {
            console.error(`Layer '${this.name}': Error during render -`, e);
        }
    }
}
