#!/usr/bin/env node

import { program } from 'commander'
import { readdirSync } from 'fs'
import { parseFile } from 'music-metadata'

class AlbumTrack {
  constructor(
    public title: string,
    public trackNumber: number,
    public discNumber: number | null,
    public duration: number,
    public iPodFilePath: string
  ) {}

  getTrackDetails(): Record<string, string | number> {
    return {
      name: this.getTrackName(),
      trackNumber: this.getTrackNumber(),
      discNumber: this.getDiscNumber(),
      duration: this.getDuration(),
    }
  }

  getTrackName(): string {
    return `${this.getTrackNumber()} - ${this.title}`
  }

  getTrackNumber(): string {
    return this.trackNumber.toString().padStart(2, '0')
  }

  getDiscNumber(): string {
    return this.discNumber?.toString() ?? ''
  }

  getDuration(): string {
    const minutes = Math.floor(this.duration / 60)
    const seconds = this.duration % 60
    return `${minutes}:${Math.round(seconds).toString().padStart(2, '0')}`
  }
}

class Album {
  constructor(
    public title: string,
    public tracks: AlbumTrack[],
    public year?: number
  ) {}

  addTrack(
    title: string,
    trackNumber: number,
    discNumber: number | null,
    duration: number,
    iPodFilePath: string
  ): void {
    this.tracks = [
      ...this.tracks,
      new AlbumTrack(title, trackNumber, discNumber, duration, iPodFilePath),
    ].sort((trackA, trackB) => trackA.trackNumber - trackB.trackNumber)
  }

  getTrackList(): Record<string, string | number>[] {
    return this.tracks.map((track) => track.getTrackDetails())
  }

  getTrackByNumber(trackNumber: number): AlbumTrack | undefined {
    return this.tracks.find((track) => track.trackNumber === trackNumber)
  }

  getTrackByName(trackName: string): AlbumTrack | undefined {
    return this.tracks.find((track) => track.title === trackName)
  }
}

class MusicLibrary {
  constructor(public artists: Record<string, Album[]> = {}) {}

  addArtist(name: string): void {
    this.artists[name] = []
  }

  getAlbumByArtistAndTitle(
    artistName: string,
    albumTitle: string
  ): Album | undefined {
    return this.artists[artistName]?.find((album) => album.title === albumTitle)
  }

  addAlbum(artistName: string, albumTitle: string, year?: number): Album {
    const newAlbum = new Album(albumTitle, [], year)
    if (!this.artists[artistName]) {
      this.artists[artistName] = []
    }
    this.artists[artistName] = [...this.artists[artistName], newAlbum].sort(
      (albumA, albumB) => {
        if (!albumA.year || !albumB.year) return 0
        return albumA.year - albumB.year
      }
    )

    return newAlbum
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
  ): void {
    if (!this.artists[artistName]) {
      this.addArtist(artistName)
    }

    const album =
      this.getAlbumByArtistAndTitle(artistName, albumTitle) ??
      this.addAlbum(artistName, albumTitle, year)

    album.addTrack(trackTitle, trackNumber, discNumber, duration, iPodFilePath)
  }

  sortArtistsByName(): void {
    this.artists = Object.fromEntries(
      Object.entries(this.artists).sort(([artistA], [artistB]) =>
        artistA.localeCompare(artistB)
      )
    )
  }
}

const compileSongs = async () => {
  const library = new MusicLibrary()
  let songCount = 0

  try {
    const folders = readdirSync('music')

    for (const folder of folders) {
      const files = readdirSync(`music/${folder}`)

      for (const file of files) {
        const iPodFilePath = `${folder}/${file}`
        const metadata = await parseFile(`music/${iPodFilePath}`)

        const {
          common: {
            albumartist: artist,
            album,
            disk: { no: discNumber },
            track: { no: trackNumber },
            title,
            year,
          },
          format: { duration },
        } = metadata

        if (
          artist === undefined ||
          album === undefined ||
          trackNumber === undefined ||
          trackNumber === null ||
          title === undefined ||
          duration === undefined
        ) {
          continue
        }

        library.addTrack(
          artist,
          album,
          title,
          trackNumber,
          discNumber,
          duration,
          iPodFilePath,
          year
        )
        songCount++
      }
    }

    library.sortArtistsByName()

    console.log(
      library
        .getAlbumByArtistAndTitle('The Beatles', 'Abbey Road')
        ?.getTrackList()
    )
  } catch (error) {
    console.error(error)
  }
}

program.command('compile').action(compileSongs)

// TODO: Get file extension from metadata
