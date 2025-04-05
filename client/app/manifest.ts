import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ClickClack',
        short_name: 'Click Clack',
        description: 'Your personal photobooth',
        start_url: '/',
        display: 'standalone',
        background_color: '#EAE6E0',
        theme_color: '#1C1C1C',
        icons: [
        {
            src: './light-icon.png',
            sizes: '192x192',
            type: 'image/png',
        },
        {
            src: './light-icon.png',
            sizes: '512x512',
            type: 'image/png',
        },
        ],
    }
}