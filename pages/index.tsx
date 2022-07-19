import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios';

import VideoCard from '../components/VideoCard';
import NoResults from '../components/NoResults';
import { Video } from '../types';
import { BASE_URL } from '../utils';

interface IProps {
    videos: Video[]
}

const Home: NextPage<IProps> = ({ videos }) => {

    return (
        <div className="flex flex-col gap-10 videos h-full">
            {
                videos.length
                ? videos.map(( video: Video ) => (
                    <VideoCard
                        post={ video }
                        key={ video._id }
                    />
                ))
                : <NoResults text="No Videos"/>
            }
        </div>
    )
}

export const getServerSideProps: GetServerSideProps<IProps> = async ({ query: { topic } }) => {

    let response = null;

    if ( topic ) {
        response = await axios.get(`${ BASE_URL }/api/discover/${ topic }`);
    } else {
        response = await axios.get(`${ BASE_URL }/api/post`);
    }

    return {
        props: {
            videos: response.data
        }
    }
}

export default Home
