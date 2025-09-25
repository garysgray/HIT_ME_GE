
// ============================================================================
// COLLISION UTILS 
// -----------------------------------------------------------------------------
// ============================================================================

function rectsCollide(a, b) {
    if (!a || !b) return false;
    return !(
        a.right  < b.left  ||
        a.left   > b.right ||
        a.bottom < b.top   ||
        a.top    > b.bottom
    );
}

function roughNear(a, b, pad = 0) {
    try 
    {
        if (!a || !b) return false;
        const dx = a.posX - b.posX;
        const dy = a.posY - b.posY;
        const r  = a.getRoughRadius()  + b.getRoughRadius() + pad;
        return (dx * dx + dy * dy) <= (r * r);
    } 
    catch (e) 
    {
        console.error("roughNear error:", e);
        return false;
    }
}