import { FC, FormEventHandler, memo, useState, useEffect } from 'react';
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

    const [ searchValue, setSearchValue ] = useState<string>('');
    const { userProfile, addUser, removeUser } = useAuthStore();

    const router = useRouter();

    const logout = () => {
        googleLogout();
        removeUser();
    }

    const handleSearch: FormEventHandler<HTMLFormElement> = event => {
        event.preventDefault();

        if (searchValue.length > 0) {
            router.push(`/search/${ searchValue }`);
        }
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

            <div className="relative hidden md:block">
                <form
                    onSubmit={ handleSearch }
                    className="absolute md:static top-10 -left-20 bg-white"
                >
                    <input
                        type="text"
                        value={ searchValue }
                        onChange={ event => setSearchValue( event.target.value ) }
                        placeholder="Busca cuentas y videos"
                        className="bg-primary p-3 md:text-md font-medium border-2 border-gray-100 focus:outline-none focus:border-2 focus:border-gray-300 w-[300px] md:w-[350px] rounded-full md:top-0"
                    />
                    <button
                        type="submit"
                        className="absolute md:right-5 right-6 top-4 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400"
                    >
                        <BiSearch />
                    </button>
                </form>
            </div>

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
