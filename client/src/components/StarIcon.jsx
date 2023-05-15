import { AiFillStar } from 'react-icons/ai'
import { IconContext } from 'react-icons/lib';
function StarIcon ({size, color, click}) {
    return (
        <div onClick={click}>
            <AiFillStar size={size} color={color}/>
        </div>
    )
}
export default StarIcon;