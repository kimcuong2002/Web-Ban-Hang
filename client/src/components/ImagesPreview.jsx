const ImagesPreview = ({ url, heading }) => {
//   console.log(`url: ${url}`);
  return (
    <div>
      {url && (
        <div className="mx-3">
          <h1 className="label block text-sm text-gray-400 mb-3">{heading}</h1>
          <div className="preivew-image flex items-center">
            <img
              src={url}
              alt="image"
              className="w-24 h-24 overflow-hidden object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default ImagesPreview;
