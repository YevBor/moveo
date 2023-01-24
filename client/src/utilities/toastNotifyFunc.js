import toast from 'react-hot-toast';

export const notifySorry = text => {
    toast.error(text, {
        duration: 1000,
        icon: '😞',
        id: 'sorry',
        style: {
            borderRadius: '20px',
            background: "#1976d2",
            padding: '30px',
            color: '#FFFFFF',
            fontSize: '30px',
            borderColor: '#00000 '
          }
        

    });
}

export const notifyError = text => {
    toast.error(text, {
        duration: 2000,
        id: 'error',
        style: {
            borderRadius: '20px',
            background: "#1976d2",
            padding: '30px',
            color: '#FFFFFF',
            fontSize: '30px',
            borderColor: '#00000 '
          }
    });
}

export const notifySuccess = text => {
    toast.success(text, {
        duration: 1000,
        id: 'success',
        style: {
            borderRadius: '20px',
            background: "#1976d2",
            padding: '30px',
            color: '#FFFFFF',
            fontSize: '30px',
            borderColor: '#00000 '
          }
    });
};