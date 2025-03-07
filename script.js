class YoutubeCrossfader {
  constructor() {
    this.currentPlayer = null;
    this.previousPlayer = null;
  }

  onPlayerReady(event) {
    event.target.setLoop(true);
  }

  onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING) {
      if (this.currentPlayer) {
        console.log('Current player is being switched. Previous player will be', this.currentPlayer);
        this.previousPlayer = this.currentPlayer;
      }
      this.currentPlayer = event.target;
    }
  }

  static crossfade({
    firstPlayer,
    secondPlayer,
    durationSecs
  }) {
    if (!firstPlayer) {
      // noting to crossfade from. use fake player.
      firstPlayer = {
        getVolume: () => 100,
        pauseVideo: () => null,
        setVolume: () => null,
      };
    }
    const targetVolume = firstPlayer.getVolume();
    const intervalMSecs = 500;
    const delta = targetVolume / (durationSecs * 1000 / intervalMSecs);
    const intervalId = setInterval(() => {
      const firstVolume = firstPlayer.getVolume();
      if (firstVolume <= 0) {
        firstPlayer.pauseVideo();
        secondPlayer.setVolume(targetVolume);
        clearInterval(intervalId);
        return;
      }
      const secondVolume = secondPlayer.getVolume();
      console.log('Crossfading', firstVolume, delta, secondVolume);
      firstPlayer.setVolume(firstVolume - delta);
      secondPlayer.setVolume(secondVolume + delta);
    }, intervalMSecs);
  }

  static build({
    videos,
    height,
    width,
    crossfadeDurationSecs,
  }) {
    const youtubeCrossfader = new YoutubeCrossfader();
    const players = [];
    videos.forEach(({
      videoId,
      playerId,
      ui
    }) => {
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
          onReady: youtubeCrossfader.onPlayerReady.bind(youtubeCrossfader),
          onStateChange: youtubeCrossfader.onPlayerStateChange.bind(youtubeCrossfader),
        },
      });

      ui.crossfadeButton.addEventListener('click', () => {
        if (youtubeCrossfader.currentPlayer == player) {
          alert('Refusing to crossfade to the same video');
          return;
        }

        player.setVolume(0);
        YoutubeCrossfader.crossfade({
          firstPlayer: youtubeCrossfader.currentPlayer,
          secondPlayer: player,
          durationSecs: crossfadeDurationSecs,
        });

        player.playVideo();
      });

      // agumenting YT Player object
      player.youtubeCrossfader = {
        videoId,
        playerId,
        ui,
      };
      players.push(player);
    });
    return youtubeCrossfader;
  }
}


function buildVideoSettings(videoId, playerId, crossfadeButtonId) {
  return {
    videoId,
    playerId,
    ui: {
      crossfadeButton: document.getElementById(crossfadeButtonId),
    },
  };
}

function onYouTubeIframeAPIReady() {
  const height = 390;
  const width = 640;
  const crossfadeDurationSecs = 10;
  const youtubeCrossfader = YoutubeCrossfader.build({
    videos: [
      buildVideoSettings('nmq9cOK-mIQ', 'player1', 'crossfade1'),
      buildVideoSettings('SMosjLl5AwM', 'player2', 'crossfade2'),
      buildVideoSettings('geeKNF_Eb9I', 'player3', 'crossfade3'),
      buildVideoSettings('K9caQYMhaC4', 'player4', 'crossfade4'),
      buildVideoSettings('Z7CFr8w9z38', 'player5', 'crossfade5'),
    ],
    height,
    width,
    crossfadeDurationSecs,
  });
}