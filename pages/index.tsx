import type { NextPage, GetServerSideProps } from 'next';
import axios from 'axios';

import VideoCard from '../components/VideoCard';
import NoResults from '../components/NoResults';
import { Video } from '../types';

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

export const getServerSideProps: GetServerSideProps<IProps> = async () => {

    const { data } = await axios.get('http://localhost:3000/api/post');

    return {
        props: {
            videos: data
        }
    }
}

export default Home
