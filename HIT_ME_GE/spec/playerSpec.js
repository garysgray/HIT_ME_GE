describe("Player Object", function() {
  let player;

  beforeEach(function() {
    // width, height, x, y, speed
    player = new Player(32, 32, 100, 100, 0);
  });

  it("should be alive by default", function() {
    expect(player.alive).toBe(true);
  });

  it("should be in AVOID state", function() {
    expect(player.state).toBe(GameDefs.playStates.AVOID);
  });

  it("should have correct initial position", function() {
    expect(player.posX).toBe(100);
    expect(player.posY).toBe(100);
  });

  it("should update position correctly", function() {
    player.movePos(150, 200);
    expect(player.posX).toBe(150);
    expect(player.posY).toBe(200);
  });

  it("should be killable", function() {
    player.kill();
    expect(player.alive).toBe(false);
  });
});
