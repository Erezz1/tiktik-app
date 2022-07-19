import type { NextApiRequest, NextApiResponse } from 'next';

import { client, searchPostsQuery } from '../../../utils';

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {

    if ( req.method === 'GET' ) {
        const { searchTerm } = req.query

        const videosQuery = searchPostsQuery( searchTerm );
        const videos = await client.fetch( videosQuery );

        res.status( 200 ).json( videos );
    }
}

export default handler;
