var Player = function () {
  this.isPlaying = false;
};

Player.prototype.play = function (song) {
  this.currentlyPlayingSong = song;
  this.isPlaying = true;
};

Player.prototype.isCurrentlyPlaying = function (song) {
  return this.isPlaying && this.currentlyPlayingSong === song;
}

Player.prototype.pause = function () {
  this.isPlaying = false;
};

Player.prototype.resume = function () {
  if (!this.isPlaying) {
    this.isPlaying = true;
  } else {
    throw Error("song is already playing");
  }
};

Player.prototype.makeFavorite = function () {
  this.currentlyPlayingSong.persistFavoriteStatus(true);
};

var Song = function () { };

Song.prototype.persistFavoriteStatus = function (b) { };

describe("Player", function() {
  var player;
  var song;

  beforeEach(function() {
    player = new Player();
    song = new Song();

    jasmine.addMatchers({
      toBePlaying: function() {
        return {
          compare: function(player, song) {
            var result = { pass: player.isCurrentlyPlaying(song) };
            if (result.pass) {
              result.message = "Expected player not to be playing " + song;
            } else {
              result.message = "Expected player to be playing " + song;
            }
            return result;
          }
        }
      }
    });
  });

  it("should be able to play a Song", function() {
    player.play(song);
    expect(player.currentlyPlayingSong).toEqual(song);

    //demonstrates use of custom matcher
    expect(player).toBePlaying(song);
  });

  describe("when song has been paused", function() {
    beforeEach(function() {
      player.play(song);
      player.pause();
    });

    it("should indicate that the song is currently paused", function() {
      expect(player.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(player).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      player.resume();
      expect(player.isPlaying).toBeTruthy();
      expect(player.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrowError("song is already playing");
    });
  });
});
