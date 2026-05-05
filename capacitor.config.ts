import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'app.engancha',
  appName: 'Engancha',
  webDir: 'dist',
  server: {
    // Carga desde la URL live → cada deploy en Vercel actualiza la app
    // sin necesidad de resubir a App Store
    url: 'https://engancha.app',
    cleartext: false,
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#0A0A0A',
    preferredContentMode: 'mobile',
  },
}

export default config
