import { mkdirSync } from 'fs'
import { Album } from '../Album/Album.js'

export class Artist {
  constructor(public name: string, private albums: Album[] = []) {}

  getAlbums(): Album[] {
    return [...this.albums]
  }

  addAlbum(title: string, year?: number): Album {
    const newAlbum = new Album(title, [], year)
    this.albums = [...this.albums, newAlbum].sort((albumA, albumB) => {
      if (albumA.year === undefined || albumB.year === undefined) {
        return albumA.title.localeCompare(albumB.title)
      }

      return albumA.year - albumB.year
    })

    return newAlbum
  }

  getAlbumList(): Record<string, unknown>[] {
    return this.albums.map((album) => ({
      title: album.title,
      year: album.year,
      trackList: album.getTrackList(),
    }))
  }

  getAlbumByTitle(title: string): Album | undefined {
    return this.albums.find((album) => album.title === title)
  }

  createArtistFolder(): void {
    try {
      mkdirSync(`./music/${this.name}`, { recursive: true })
      console.log(`Created folder for ${this.name}`)
    } catch (error: any) {
      if (error.code === 'EEXIST') {
        console.log(`Folder for ${this.name} already exists`)
      } else {
        console.error(`Error creating ${this.name} folder`, error)
      }
    }
  }
}
