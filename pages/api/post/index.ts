import type { NextApiRequest, NextApiResponse } from 'next';
import { client, allPostsQuery } from '../../../utils';

const handler = async ( req: NextApiRequest, res: NextApiResponse ) => {

    if ( req.method === 'GET' )  {
        const query = allPostsQuery();
        const data = await client.fetch( query );
        res.status(200).json( data );

    } else if ( req.method === 'POST' ) {
        const document = req.body;
        client
            .create( document )
            .then( data => () => res.status(201).json({
                message: 'Video creado'
            }))
            .catch( err => () => res.status(500).json({
                message: 'Error al crear video'
            }));
    }

}

export default handler;
