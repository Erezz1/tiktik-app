import { useState, useEffect, useRef, FormEventHandler } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { GoVerified } from 'react-icons/go';
import { MdOutlineCancel } from 'react-icons/md';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';
import axios from 'axios';

import Comments from '../../components/Comments';
import LikeButton from '../../components/LikeButton';
import { BASE_URL } from '../../utils';
import { Video } from '../../types';
import { useAuthStore } from '../../store/authStore';

interface IProps {
    postDetails: Video;
}
const Detail: NextPage<IProps> = ({ postDetails }) => {

    const [ post, setPost ] = useState<Video>( postDetails );
    const [ isPlaying, setIsPlaying ] = useState<boolean>( false );
    const [ isVideoMuted, setIsVideoMuted ] = useState<boolean>( false );
    const [ comment, setComment ] = useState<string>('');
    const [ isPostingComment, setIsPostingComment ] = useState<boolean>( false );

    const videoRef = useRef<HTMLVideoElement>( null );

    const router = useRouter();

    const { userProfile }: any = useAuthStore();

    const onVideoClick = () => {
        if ( isPlaying ) {
            videoRef.current?.pause();
            setIsPlaying( false );
        } else {
            videoRef.current?.play();
            setIsPlaying( true );
        }
    }

    useEffect( () => {
        if ( post && videoRef?.current ) {
            videoRef.current.muted = isVideoMuted;
        }
    }, [ post, isVideoMuted ]);

    const handleLike = async ( like: boolean ) => {
        if ( userProfile ) {
            const { data } = await axios.put(`${ BASE_URL }/api/like`, {
                userId: userProfile._id,
                postId: post._id,
                like
            });

            setPost( prev => ({ ...prev, likes: data.likes }));
        }
    }

    const addComment: FormEventHandler = async ( event ) => {
        event.preventDefault();

        if ( userProfile && comment ) {
            setIsPostingComment( true );

            const { data } = await axios.put(`${ BASE_URL }/api/post/${ post._id }`, {
                userId: userProfile._id,
                comment
            });

            setPost( prev => ({
                ...prev,
                comments: data.comments
            }));
            setComment('');
            setIsPostingComment( false );
        }
    }

    if ( !post ) {
        return null;
    }

    return (
        <div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap">
            <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-black">
                <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
                    <p
                        className="cursor-pointer"
                        onClick={ () => router.back() }
                    >
                        <MdOutlineCancel className="text-white text-[35px]"/>
                    </p>
                </div>
                <div className="relative">
                    <div className="lg:h-[100vh] h-[60vh]">
                        <video
                            className="h-full cursor-pointer"
                            ref={ videoRef }
                            loop
                            src={ post.video.asset.url }
                            onClick={ onVideoClick }
                        ></video>
                    </div>

                    <div className="absolute top-[45%] left-[45%] cursor-pointer">
                    {
                        !isPlaying && (
                            <button onClick={ onVideoClick }>
                                <BsFillPlayFill className="text-white text-6xl lg:text-8xl"/>
                            </button>
                        )
                    }
                    </div>              
                </div>

                <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
                {
                    isVideoMuted
                    ? (
                        <button
                            onClick={ () => setIsVideoMuted( false ) }
                            className="text-white text-2xl lg:text-4xl"
                        >
                            <HiVolumeOff />
                        </button>
                    )
                    : (
                        <button
                            onClick={ () => setIsVideoMuted( true ) }
                            className="text-white text-2xl lg:text-4xl"
                        >
                            <HiVolumeUp />
                        </button>
                    )
                }
                </div>
            </div>

            <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
                <div className="lg:mt-20 mt-10">
                    <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
                        <div className="ml-4 md:w-20 md:h-20 w-16 h-16">
                            <Link href="/" passHref>
                                <>
                                <Image
                                    width={62}
                                    height={62}
                                    className="rounded-full"
                                    src={ post.postedBy.image }
                                    alt="foto de perfil"
                                    layout="responsive"
                                />
                                </>
                            </Link>
                        </div>

                        <div>
                            <Link href="/" passHref>
                                <div className="mt-3 flex flex-col gap-2">
                                    <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                                        { post.postedBy.userName }
                                        <GoVerified className="text-blue-400 text-md" />
                                    </p>
                                    <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">{ post.postedBy.userName }</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    <p className="px-10 text-lg text-gray-600">{ post.caption }</p>

                    <div className="mt-10 px-10">
                        {userProfile && (
                            <LikeButton
                                likes={ post.likes }
                                handleLike={ () => handleLike( true ) }
                                handleDislike={ () => handleLike( false ) }
                            />
                        )}
                    </div>

                    <Comments
                        comment={ comment }
                        setComment={ setComment }
                        addComment={ addComment }
                        isPostingComment={ isPostingComment }
                        comments={ post.comments }
                    />
                </div>
            </div>
        </div>
    )
}

interface IGetServerSideProps {
    params: {
        id: string
    }
}
export const getServerSideProps = async ({
    params: { id }
}: IGetServerSideProps ) => {
    const { data } = await axios.get(`${ BASE_URL }/api/post/${ id }`);

    return {
        props: { postDetails: data }
    }
}

export default Detail;
