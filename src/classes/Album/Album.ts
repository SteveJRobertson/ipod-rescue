import { mkdirSync } from 'fs'
import { Song } from '../Song/Song.js'

export class Album {
  constructor(
    public title: string,
    private tracks: Song[] = [],
    public year?: number
  ) {}

  getTracks(): Song[] {
    return [...this.tracks]
  }

  addTrack(
    title: string,
    trackNumber: number | null,
    discNumber: number | null,
    duration: number | undefined,
    iPodFilePath: string
  ): Song {
    const newSong = new Song(
      title,
      trackNumber,
      discNumber,
      duration,
      iPodFilePath
    )
    this.tracks = [...this.tracks, newSong].sort((trackA, trackB) => {
      if (trackA.trackNumber === null || trackB.trackNumber === null) {
        return trackA.title.localeCompare(trackB.title)
      }

      return trackA.trackNumber - trackB.trackNumber
    })
    // TODO: Sort by disc number and track number

    return newSong
  }

  getTrackList(): Record<string, string | number | null>[] {
    return this.tracks.map((track) => track.getTrackDetails())
  }

  getTrackByNumber(trackNumber: number): Song | undefined {
    return this.tracks.find((track) => track.trackNumber === trackNumber)
  }

  getTrackByName(trackName: string): Song | undefined {
    return this.tracks.find((track) => track.title === trackName)
  }

  createAlbumFolder(artistName: string): void {
    try {
      mkdirSync(`./music/${artistName}/${this.title}`, { recursive: true })
      console.log(`Created folder for ${this.title} by ${artistName}`)
    } catch (error: any) {
      if (error.code === 'EEXIST') {
        console.log(`Folder for ${this.title} by ${artistName} already exists`)
      } else {
        console.error(
          `Error creating ${this.title} by ${artistName} folder`,
          error
        )
      }
    }
  }
}
