const Modal = ({ message, onClose }: { message: string; onClose: () => void }) => {
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className=" flex flex-col justify-center text-center bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
                <h2 className="text-3xl mr-4 py-2 font-chillax font-bold">{message}</h2>
                <button
                    onClick={onClose}
                    className="bg-[#1C1C1C] text-white py-2 px-4 rounded-lg hover:bg-[#535366] transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default Modal;
