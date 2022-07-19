import type { NextApiRequest, NextApiResponse } from 'next';

import { client, topicPostsQuery } from '../../../utils';

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {

    if ( req.method === 'GET' ) {
        const { topic } = req.query;

        const videosQuery = topicPostsQuery( topic );

        const videos = await client.fetch( videosQuery );

        res.status( 200 ).json( videos );
    }
}

export default handler;
