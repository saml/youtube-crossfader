class YoutubeCrossfader {
  constructor(players) {
    this.players = players;
  }

  static initPlayer(player) {
    // player.pauseVideo();
    // player.setLoop(true);
  }

  static onPlayerReady(event) {
    event.target.setLoop(true);
  }

  static onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      console.log(event.target);
    }
  }

  static build({
    videos,
    height,
    width
  }) {
    const players = [];
    videos.forEach(([videoId, playerId]) => {
      const player = new YT.Player(playerId, {
        height,
        width,
        videoId,
        playerVars: {
          playlist: videoId,
          playsinline: 1,
          loop: 1,
        },
        events: {
          onReady: YoutubeCrossfader.onPlayerReady,
          onStateChange: YoutubeCrossfader.onPlayerStateChange,
        },
      });
      players.push(player);
    });
    return new YoutubeCrossfader(players);
  }
}

function onYouTubeIframeAPIReady() {
  const height = 390;
  const width = 640;
  const youtubeCrossfader = YoutubeCrossfader.build({
    videos: [
      ['nmq9cOK-mIQ', 'player1'],
      ['SMosjLl5AwM', 'player2'],
      ['K9caQYMhaC4', 'player3'],
    ],
    height,
    width,
  });
}