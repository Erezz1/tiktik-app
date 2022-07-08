import axios from 'axios';
import { CredentialResponse } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

import { IUser } from '../types';

// export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const BASE_URL = 'http://localhost:3000';

interface IUserDecoded{
    name: string;
    picture: string;
    sub: string;
}

export const createOrGetUser = async ( response: CredentialResponse, addUser: any ) => {

    if ( !response.credential ) return;

    const decoded = jwt_decode<IUserDecoded>( response.credential );
    const { name, picture, sub } = decoded;

    const user: IUser = {
        _id: sub,
        _type: 'user',
        userName: name,
        image: picture,
    }

    addUser( user );

    await axios.post( `${ BASE_URL }/api/auth`, user );
};

export * from './constants';
export * from './client';
export * from './queries';
