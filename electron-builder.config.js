module.exports = {
  appId: 'com.gamedev.dashboard',
  productName: 'Game Dev Dashboard',
  directories: {
    output: 'dist'
  },
  files: ['dist/**/*', 'public/main.js', 'public/preload.js', 'package.json'],
  asar: true,
  extraMetadata: {
    main: 'public/main.js'
  },
  win: {
    icon: 'src/assets/icon.png',
    target: ['nsis']
  },
  nsis: {
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'Game Dev Dashboard'
  },
  mac: {
    icon: 'src/assets/icon.png',
    target: ['dmg']
  },
  linux: {
    icon: 'src/assets/icon.png',
    target: ['AppImage']
  }
};
