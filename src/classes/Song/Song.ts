import { access, constants, copyFile, mkdir } from 'fs/promises'
import path from 'path'

export class Song {
  constructor(
    public title: string,
    public trackNumber: number | null,
    public discNumber: number | null,
    public duration: number | undefined,
    public iPodFilePath: string
  ) {}

  getTrackDetails(): Record<string, string | number | null> {
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

  getTrackNumber(): string | null {
    return this.trackNumber
      ? this.trackNumber.toString().padStart(2, '0')
      : null
  }

  getDiscNumber(): string {
    return this.discNumber?.toString() ?? ''
  }

  getDuration(): string | null {
    if (!this.duration) {
      return null
    }

    const minutes = Math.floor(this.duration / 60)
    const seconds = this.duration % 60
    return `${minutes}:${Math.round(seconds).toString().padStart(2, '0')}`
  }

  async copyIpodFileToLibrary(artistName: string, albumTitle: string) {
    try {
      await access(
        path.resolve('music', artistName, albumTitle),
        constants.F_OK
      )
      console.log(`Folder for ${albumTitle} by ${artistName} already exists`)
    } catch (error: any) {
      await mkdir(path.resolve('music', artistName, albumTitle), {
        recursive: true,
      })
      console.log(`Created folder for ${albumTitle} by ${artistName}`)
    }

    try {
      await copyFile(
        path.resolve('ipod_music', this.iPodFilePath),
        path.resolve(
          'music',
          artistName,
          albumTitle,
          `${this.getTrackName()}.mp3`.replace(/\//g, '_')
        )
      )
      console.log(`Copied ${this.title} to library`)
    } catch (error: any) {
      if (error.code === 'EEXIST') {
        console.log(`${this.title} already exists in library`)
      } else {
        console.error(`Error copying ${this.title} to library`)
        throw new Error(error)
      }
    }
  }
}
