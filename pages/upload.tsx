import { useState, useEffect, FC, ChangeEventHandler } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { SanityAssetDocument } from '@sanity/client';

import { useAuthStore } from '../store/authStore';
import { client, topics } from '../utils';

const Upload: FC = () => {

    const [ isLoading, setIsLoading ] = useState<boolean>( false );
    const [ videoAsset, setVideoAsset ] = useState<SanityAssetDocument | undefined>();
    const [ wrongFileType, setWrongFileType ] = useState<boolean>( false );
    const [ caption, setCaption ] = useState<string>('');
    const [ category, setCategory ] = useState<string>( topics[0].name );
    const [ savingPost, setSavingPost ] = useState<boolean>( false );

    const { userProfile }: { userProfile: any } = useAuthStore();
    const router = useRouter();

    const uploadVideo: ChangeEventHandler<HTMLInputElement> = ( event:any ) => {
        setIsLoading( true );
        const selectedFile = event?.target?.files[ 0 ];
        const fileTypes = ['video/mp4', 'video/webm', 'video/ogg'];

        if ( fileTypes.includes( selectedFile.type ) ) {
            client.assets.upload('file', selectedFile, {
                contentType: selectedFile.type,
                filename: selectedFile.name,
            })
            .then( data => {
                setVideoAsset( data );
                setIsLoading( false );
            })
            .catch( error => {
                console.error( error );
                setIsLoading( false );
            });
        } else {
            setIsLoading( false );
            setWrongFileType( true );
        }
    }

    const handlePost = async () => {
        if ( caption && videoAsset?._id && category ) {
            setSavingPost( true );

            const document = {
                _type: 'post',
                caption,
                video: {
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: videoAsset?._id,
                    }
                },
                userId: userProfile?._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: userProfile?._id,
                },
                topic: category
            }

            await axios.post('http://localhost:3000/api/post', document );
            router.push('/');
        }
    }

    return (
        <div className="flex w-full h-full absolute left-0 top-[60px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center">
            <div className="bg-white rounded-lg xl:h-[80vh] w-[60%] flex justify-between gap-6 flex-wrap items-center p-14 pt-6">
                <div>
                    <div>
                        <p className="text-2xl font-bold">Subir video</p>
                        <p className="text-md text-gray-400 mt-1">Publica un video a tu cuenta</p>
                    </div>
                    <div className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100">
                        {
                            isLoading
                            ? (
                                <p>Subiendo...</p>
                            )
                            : (
                                <div>
                                    {
                                        videoAsset
                                        ? (
                                            <div>
                                                <video
                                                    src={ videoAsset.url }
                                                    loop
                                                    controls
                                                    className="rounded-xl h-[450px] mt-16 bg-black"
                                                ></video>
                                            </div>
                                        )
                                        : (
                                            <label className="cursor-pointer">
                                                <div className="flex flex-col items-center justify-center h-full">
                                                    <div className="flex flex-col items-center justify-center h-full">
                                                        <p className="font-bold text-xl">
                                                            <FaCloudUploadAlt className="text-gray-300 text-6xl" />
                                                        </p>
                                                        <p className="text-xl font-semibold">
                                                            Sube un Video
                                                        </p>
                                                    </div>
                                                    <p className="text-gray-400 text-center mt-10 text-sm leading-10">
                                                        MP4 o WebM o ogg <br />
                                                        720x1280 o superior <br />
                                                        Hasta 10 minutos <br />
                                                        Menos de 2GB
                                                    </p>
                                                    <p className="bg-[#F51997] text-center mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none">
                                                        Selecciona archivo
                                                    </p>
                                                </div>

                                                <input
                                                    type="file"
                                                    name="upload-video"
                                                    className="w-0 h-0"
                                                    onChange={ uploadVideo }
                                                />
                                            </label>
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            wrongFileType && (
                                <p className="text-center text-xl text-red-400 font-semibold mt-4 w-[450px]">
                                    Por favor selecciona un video valido
                                </p>
                            )
                        }
                    </div>
                </div>

                <div className="flex flex-col gap-3 pb-10">
                    <label className="text-md font-medium">Caption</label>
                    <input
                        type="text"
                        value={ caption }
                        onChange={ event => setCaption( event.target.value ) }
                        className="rounded outline-none text-md border-2 border-gray-200 p-2"
                    />
                    <label className="text-md font-medium">Choose a Category</label>
                    <select
                        onChange={ event => setCategory( event.target.value ) }
                        className="outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer"
                    >
                        {
                            topics.map( topic => (
                                <option
                                    value={ topic.name }
                                    key={ topic.name }
                                    className="outline-none capitalize bg-white text-gray-700 p-2 hover:bg-slate-300"
                                >{ topic.name }</option>
                            ))
                        }
                    </select>

                    <div className="flex gap-6 mt-10">
                        <button
                            onClick={ () => {} }
                            type="button"
                            className="border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none"
                        >
                            Discard
                        </button>

                        <button
                            onClick={ handlePost }
                            type="button"
                            className="bg-[#F51997] text-white border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none disabled:opacity-70"
                            disabled={ isLoading }
                        >
                            { isLoading ? 'Subiendo...' : 'Publicar' }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Upload;
