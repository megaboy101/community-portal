import React, { useState, useRef, useEffect, useCallback } from 'react';
import { storage } from '../firebase';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, Box } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: ({ size }) => size,
    height: ({ size }) => size,
    background: 'black',
    '&> img:hover': {
      opacity: 0.5
    }
  }
}));

export const UploadAvatar = ({
  companyID = '',
  size = 100,
  className,
  ...avatarProps
}) => {
  const [progress, setProgress] = useState(0);
  const [imageReady, setImageReady] = useState(false);
  const urlRef = useRef(storage.ref(`companyLogos/${companyID}`));
  const [downloadURL, setDownloadURL] = useState();
  const classes = useStyles({ size });
  const uploadRef = useRef();
  const uploadEl = uploadRef.current;

  useEffect(() => {
    if (downloadURL) {
      const img = new Image();
      img.src = downloadURL;
      img.onload = () => {
        setImageReady(true);
        setProgress(0);
      };
    } else if (downloadURL === '') {
      setImageReady(true);
    }
  }, [downloadURL]);

  useEffect(() => {
    urlRef.current
      .getDownloadURL()
      .then(setDownloadURL)
      .catch(() => setDownloadURL(''));
  }, []);

  const changeHandler = useCallback(() => {
    const file = uploadRef.current.files.item(0);

    const task = urlRef.current.put(file);
    setProgress(0);
    setImageReady(false);

    task.on('state_changed', snapshot => {
      setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    });

    task.then(() => urlRef.current.getDownloadURL()).then(setDownloadURL);
  }, []);

  useEffect(() => {
    if (uploadEl) {
      uploadEl.addEventListener('change', changeHandler);
      return () => uploadEl.removeEventListener('change', changeHandler);
    }
  }, [uploadEl, changeHandler]);

  return (
    <div className={className}>
      <Box
        borderRadius="50%"
        border="3px solid white"
        display="inline-block"
        boxShadow={3}
        bgcolor="white"
      >
        {imageReady && (
          <Avatar
            className={classes.avatar}
            {...avatarProps}
            src={downloadURL}
            onClick={e => uploadRef.current.click()}
          />
        )}
        {!imageReady && (
          <CircularProgress
            size={size}
            thickness={1}
            color="black"
            variant={
              progress < 100 && progress > 0 ? 'static' : 'indeterminate'
            }
            value={progress}
          />
        )}
        <input type="file" hidden ref={uploadRef} />
      </Box>
    </div>
  );
};

export default UploadAvatar;
