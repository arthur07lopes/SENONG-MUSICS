fetch('../componentes/playlist/index.Playlist.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('playlist-container').innerHTML = data;
  });
