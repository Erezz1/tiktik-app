import sanityClient from '@sanity/client';

export const client = sanityClient({
    projectId: 'zmdzs0s2',
    dataset: 'production',
    apiVersion: '2022-06-05',
    useCdn: false,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
    ignoreBrowserTokenWarning: true
});
