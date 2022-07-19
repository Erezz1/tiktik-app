import { useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { GoVerified } from 'react-icons/go';

import VideoCard from '../../components/VideoCard';
import NoResults from '../../components/NoResults';
import { IUser, Video } from '../../types';
import { BASE_URL } from '../../utils';
import { useAuthStore } from '../../store/authStore';

interface IProps {
    videos: Video[];
}
const Search: NextPage<IProps> = ({ videos }) => {

    const [ isAccounts, setIsAccounts ] = useState<boolean>( true );

    const router = useRouter();
    const { searchTerm }: any = router.query;

    const { allUsers } = useAuthStore();

    const isVideos = !isAccounts ? 'border-b-2 border-black' : 'text-gray-400';
    const accounts = isAccounts ? 'border-b-2 border-black' : 'text-gray-400';

    const searchedAccounts: IUser[] = allUsers.filter(
        ( user: IUser ) => user.userName.toLowerCase().includes( searchTerm.toLowerCase() )
    );

    return (
        <div className="w-full">
            <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
                <p
                    className={`text-xl font-semibold cursor-pointer mt-2 ${ accounts }`}
                    onClick={ () => setIsAccounts( true ) }
                >Cuentas</p>

                <p
                    className={`text-xl font-semibold cursor-pointer mt-2 ${ isVideos }`}
                    onClick={ () => setIsAccounts( false ) }
                >Videos</p>
            </div>
            {
                isAccounts
                ? (
                    <div className="md:mt-16">
                        {
                            searchedAccounts.length > 0
                            ? searchedAccounts.map(( user, index ) => (
                                <Link
                                    href={`/profile/${ user._id }`}
                                    key={ index }
                                >
                                    <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200">
                                        <div>
                                            <Image
                                                src={ user.image }
                                                alt="Perfil de usuario"
                                                width={ 50 }
                                                height={ 50 }
                                                className="rounded-full"
                                            />
                                        </div>
                                        <div className="hidden lg:block">
                                            <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                                                { user.userName.replace(' ', '') }
                                                <GoVerified className="text-blue-400" />
                                            </p>
                                            <p className="capitalize text-gray-400 text-xs">
                                                { user.userName }
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                            : <NoResults text={`No hay usuarios con el nombre ${ searchTerm }`} />
                        }
                    </div>
                )
                : (
                    <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
                        {
                            videos.length > 0
                            ? videos.map(( video, index ) => (
                                <VideoCard
                                    key={ index }
                                    post={ video }
                                />
                            ))
                            : <NoResults text={`No hay videos para la busqueda ${ searchTerm }`} />
                        }
                    </div>
                )
            }
        </div>
    );
}

interface IServerSideProps {
    params: {
        searchTerm: string;
    }
}
export const getServerSideProps = async ({ params: { searchTerm } }: IServerSideProps ) => {
    const { data } = await axios.get(`${ BASE_URL }/api/search/${ searchTerm }`);

    return {
        props: { 
            videos: data
        }
    }
}

export default Search;
