import {
  combinePresetAndAppleSplashScreens,
  defineConfig,
  minimal2023Preset,
} from '@vite-pwa/assets-generator/config'

// ref: https://vite-pwa-org.netlify.app/assets-generator/cli.html#configurations

export default defineConfig({
  headLinkOptions: {
    preset: '2023',
  },
  preset: combinePresetAndAppleSplashScreens(
    minimal2023Preset,
    {
      resizeOptions: { background: 'white', fit: 'contain' },
      darkResizeOptions: { background: 'black', fit: 'contain' },
    },
    ['iPad Pro 12.9"'],
  ),
  images: ['public/mathub-app-icon.svg'],
})
