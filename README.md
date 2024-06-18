# iPod Resuce

## Description

This is a simple program that will help you to recover your iPod music files. It will copy all the music files from your iPod to your computer and restructure them into artist and album order.

## Features

- Copy music files from your iPod to your computer
- Organize music files by artist and album

## Requirements

- Node.js
- npm

## Installation and Usage

1. Clone the repository
2. Run `npm install`
3. Copy iPod music files to the `ipod_music` folder
4. Run `npm start`

The music files will be copied to the `music` folder with the following structure:

```
music
├── Artist 1
│   ├── Album 1
│   │   ├── Song 1.mp3
│   │   ├── Song 2.mp3
│   │   └── ...
│   └── Album 2
│       ├── Song 1.mp3
│       └── ...
└── Artist 2
    └── ...
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## History

- 0.1.0: First release

## Credits

- [music-metadata](https://github.com/borewit/music-metadata)
