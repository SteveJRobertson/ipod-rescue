import { readdirSync } from 'fs'
import { parseFile } from 'music-metadata'
import { Artist } from './classes/Artist/Artist.js'

const getMetadata = async () => {
  try {
    const folders = readdirSync('ipod_music')

    for (const folder of folders) {
      const files = readdirSync(`ipod_music/${folder}`)

      for (const file of files) {
        const iPodFilePath = `${folder}/${file}`
        const metadata = await parseFile(`ipod_music/${iPodFilePath}`)

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

        if (!artist || !album || !title) {
          continue
        }

        const currentArtist = new Artist(artist)
        const currentAlbum = currentArtist.addAlbum(album, year)
        const currentTrack = currentAlbum.addTrack(
          title,
          trackNumber,
          discNumber,
          duration,
          iPodFilePath
        )

        currentTrack.copyIpodFileToLibrary(
          currentArtist.name,
          currentAlbum.title
        )
      }
    }
  } catch (error) {
    console.error(error)
  }
}

getMetadata()

// TODO: Get file extension from metadata
