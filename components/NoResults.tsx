import { FC } from 'react';

interface IProps {
    text: string;
}

const NoResults: FC<IProps> = ({ text }) => {
    return (
        <div>
            No Results
        </div>
    )
}

export default NoResults;
