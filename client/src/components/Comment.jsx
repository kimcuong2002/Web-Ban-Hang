import { useMemo } from 'react';
import StarIcon from './StarIcon';

function Comment({
  onComment,
  comments,
  setComment,
  comment,
  setErrorComment,
  errorComment,
}) {
  return (
    <div className="">
      <h3 className="text-lg uppercase border-b border-x-gray-500">Comment</h3>
      <hr></hr>
      <textarea
        value={comment.content}
        onChange={(e) => {
          setComment({ ...comment, content: e.target.value })
          setErrorComment('')
        }}
        className=" placeholder:text-sm my-2 resize-y rounded-md w-full p-3 drop-shadow-lg border border-x-gray-500"
        placeholder="Enter your comment..."
      ></textarea>
      <div className="h-[30px]">{errorComment && <p className='text-sm text-red-500'>{errorComment}</p>}</div>
      <button
        onClick={onComment}
        className="py-1 px-3 cursor-pointer bg-green-700 text-sm font-medium text-white rounded hover:bg-green-600"
      >
        Comment
      </button>
      {comments?.map((comment) => (
        <CommentChild
          key={comment?.id}
          avatar={comment?.user.avatar}
          userName={comment?.user.username}
          rating={comment?.rating}
          content={comment?.comment}
          time={comment?.createdAt}
        />
      ))}
    </div>
  );
}

const CommentChild = ({ avatar, userName, rating, content, time }) => {
  const setUpReating = () => {
    const arr = [];
    for (let i = 0; i < rating; i++) {
      arr.push(i);
    }
    return arr;
  };

  const setUpDate = () => {
    const hour = new Date(time).getHours();
    const minute = new Date(time).getMinutes();
    const second = new Date(time).getSeconds();
    const day = new Date(time).getDate();
    const month = new Date(time).getMonth();
    const year = new Date(time).getFullYear();

    return `${day}-${month}-${year} at ${hour}:${minute}:${second}`;
  };
  const rate = useMemo(() => {
    return setUpReating();
  }, [rating]);

  const timeReview = useMemo(() => {
    if (time) {
      return setUpDate();
    }
  }, [time]);

  return (
    <div className="border-b my-4 border-gray-300 py-4">
      <div className=" flex justify-start ">
        <div className="rounded-full ">
          <img
            className="inline-block h-12 w-12 rounded-full ring-2 ring-white"
            src={`../${import.meta.env.VITE_PATH_IMAGE}/users/${avatar}`}
          />
        </div>
        <div className="ml-8">
          <p>{userName}</p>
          <div className="flex justify-start">
            {rate.map((item) => (
              <StarIcon key={item} size="0.7rem" color="orange" />
            ))}
          </div>
          <p className="text-gray-700 text-xs mt-1">{timeReview}</p>
        </div>
      </div>
      <p className="text-xs mt-5">{content}</p>
    </div>
  );
};

export default Comment;
