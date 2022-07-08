import { memo, FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { useRouter } from 'next/router';
import { AiOutlineLogout } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { IoMdAdd } from 'react-icons/io';

import logo from '../public/tiktik-logo.png';
import { createOrGetUser } from '../utils';
import { useAuthStore } from '../store/authStore';

const Navbar: FC = () => {

    const { userProfile, addUser, removeUser } = useAuthStore();

    const logout = () => {
        googleLogout();
        removeUser();
    }

    return (
        <div className="w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4">
            <Link href="/" passHref>
                <div className="w-[100px] md:w-[130px] h-[30px] md:mb-2">
                    <Image
                        className="cursor-pointer"
                        src={ logo }
                        alt="Logotipo de TikTik"
                        layout="responsive"
                        priority
                    />
                </div>
            </Link>

            <div>SEARCH</div>

            <div>
                {
                    userProfile
                    ? (
                        <div className="flex gap-5 md:gap-10">
                            <Link href="/upload">
                                <button className="border-2 px-2 md:px-4 text-md font-semibold flex items-center gap-2">
                                    <IoMdAdd className="text-xl"/> {' '}
                                    <span className="hidden md:block">Upload</span>
                                </button>
                            </Link>
                            {
                                userProfile.image && (
                                    <Link href="/" passHref>
                                        <>
                                        <Image
                                            width={40}
                                            height={40}
                                            className="rounded-full cursor-pointer"
                                            src={ userProfile.image }
                                            alt="foto de perfil"
                                        />
                                        </>
                                    </Link>
                                )
                            }
                            <button
                                type="button"
                                className="px-2 shadow-sm shadow-gray-500 rounded-full"
                                onClick={ logout }
                            >
                                <AiOutlineLogout color="red" fontSize={21} />
                            </button>
                        </div>
                    )
                    : (
                        <GoogleLogin
                            onSuccess={ response => createOrGetUser( response, addUser ) }
                            onError={ () => { console.log( 'error' ) }}
                        />
                    )
                }
            </div>
        </div>
    )
}

export default memo( Navbar );
