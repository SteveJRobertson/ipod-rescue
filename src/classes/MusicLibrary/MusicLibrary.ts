import { Album } from '../Album/Album.js'
import { Artist } from '../Artist/Artist.js'
import { Song } from '../Song/Song.js'

export class MusicLibrary {
  private artists: Artist[] = []

  getArtistByName(name: string): Artist | undefined {
    return this.artists.find((artist) => artist.name === name)
  }

  getAlbumByArtistAndTitle(
    artistName: string,
    albumTitle: string
  ): Album | undefined {
    const artist = this.getArtistByName(artistName)
    return artist?.getAlbumByTitle(albumTitle)
  }

  addArtist(name: string): Artist {
    const newArtist = new Artist(name)
    this.artists = [...this.artists, newArtist].sort((artistA, artistB) =>
      artistA.name.localeCompare(artistB.name)
    )

    return newArtist
  }

  addAlbum(artistName: string, albumTitle: string, year?: number): Album {
    const artist =
      this.getArtistByName(artistName) ?? this.addArtist(artistName)

    return artist.addAlbum(albumTitle, year)
  }

  addTrack(
    artistName: string,
    albumTitle: string,
    trackTitle: string,
    trackNumber: number,
    discNumber: number | null,
    duration: number,
    iPodFilePath: string,
    year?: number
  ): Song {
    const album =
      this.getAlbumByArtistAndTitle(artistName, albumTitle) ??
      this.addAlbum(artistName, albumTitle, year)

    return album.addTrack(
      trackTitle,
      trackNumber,
      discNumber,
      duration,
      iPodFilePath
    )
  }
}
