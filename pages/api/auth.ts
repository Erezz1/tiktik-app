import type { NextApiRequest, NextApiResponse } from 'next';
import { client } from '../../utils';

interface Data {
    message: string;
}

const handler = async ( req: NextApiRequest, res: NextApiResponse<Data> ) => {

    if ( req.method === 'POST' ) {
        const user = req.body;
        await client.createIfNotExists( user );
        res
            .status( 200 )
            .json({ message: 'User created' });
    }
}

export default handler;
