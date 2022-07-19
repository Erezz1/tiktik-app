import type { NextApiRequest, NextApiResponse } from 'next';

import { client, allUsersQuery } from '../../utils';

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {

    if ( req.method === 'GET' ) {
        const data = await client.fetch( allUsersQuery() );

        if ( data ) {
            res.status( 200 ).json( data );
        } else {
            res.json([]);
        }
    }
}

export default handler;
