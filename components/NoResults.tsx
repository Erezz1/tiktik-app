import { FC } from 'react';
import { MdOutlineVideocamOff } from 'react-icons/md';
import { BiCommentX } from 'react-icons/bi';

interface IProps {
    text: string;
}

const NoResults: FC<IProps> = ({ text }) => {
    return (
        <div className="flex flex-col justify-center items-center h-full w-full">
            <p className="text-8xl">
                {
                    text === 'No hay comentarios.'
                        ? <BiCommentX />
                        : <MdOutlineVideocamOff />
                }
            </p>
            <p className="text-2xl text-center">{ text }</p>
        </div>
    )
}

export default NoResults;
