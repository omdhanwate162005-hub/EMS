import React from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info';

    return (
        <div className="toast show" role="alert">
            <div className={`toast-header ${bgClass} text-white`}>
                <i className={`fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2`}></i>
                <strong className="me-auto">{type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}</strong>
                <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="toast-body">
                {message}
            </div>
        </div>
    );
};

export const withToast = (WrappedComponent) => {
    return (props) => {
        const [toast, setToast] = React.useState(null);

        const showToast = (message, type = 'success') => {
            setToast({ message, type });
        };

        const hideToast = () => {
            setToast(null);
        };

        return (
            <>
                <WrappedComponent {...props} showToast={showToast} />
                {toast && (
                    <div className="toast-container">
                        <Toast {...toast} onClose={hideToast} />
                    </div>
                )}
            </>
        );
    };
};

export default Toast;
