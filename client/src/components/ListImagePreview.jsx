import { AiFillCloseCircle } from "react-icons/ai";

const ListImagePreview = ({ images }) => {
    return (
        <div className="h-[150px] w-full flex justify-start items-center gap-3">
            {
                images.map((image, index) => (
                    <div key={index} className="relative">
                        <img className="w-[150px] object-cover" src={image} />
                    </div>
                ))
            }
        </div>
    )
}

export default ListImagePreview;