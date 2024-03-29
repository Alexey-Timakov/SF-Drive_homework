import { AxiosRequestConfig } from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { $api, controller } from "../../http";
import { IRegStep } from '../../interfaces/IRegStep';
import { IState } from '../../Interfaces/IState';
import { IUserAvatarInfo } from '../../Interfaces/IUserAvatarInfo';
import CircleProgressBar from '../CircleProgressBar/CircleProgressBar';
import { addUserInfoToStateAction } from '../../Actions/addUserInfoToStateAction';

import "./RegStep2.scss";

export default function RegStep2({ changeRegStep, toggleErrorBar }: IRegStep) {

  const videoContainer = useRef(null);
  const photoContainer = useRef(null);
  const cameraVideo = useRef(null);
  const cameraPhoto = useRef(null);
  const submitButton = useRef(null);

  const breakpointMobile: number = 768;

  const canvasWidth: number = document.body.clientWidth < breakpointMobile ? 305 : 430;
  const canvasHeight: number = document.body.clientWidth < breakpointMobile ? 228 : 320;

  const userID = useSelector((state: IState) => state?.user?.id);
  const dispatch = useDispatch();

  const [percent, setPercent] = useState<number>(0);
  const [isLoading, setLoadingStatus] = useState<boolean>(false);
  const [isPhotoError, setPhotoError] = useState<boolean>(false);

  const calculateUploadPercent = (loaded: number, total: number) => {
    const result = Math.round(loaded * 100 / total);
    setPercent(result);
  }


  const axiosConfig: AxiosRequestConfig = {
    signal: controller.signal,
    onUploadProgress: ((progressEvent: ProgressEvent) => {
      calculateUploadPercent(progressEvent.loaded, progressEvent.total);
    })
  }

  const enableSubmitButton = () => {
    const submitButtonCurrent = submitButton.current;
    submitButtonCurrent.classList.add("is-active");
    submitButtonCurrent.disabled = false;
  }

  const disableSubmitButton = () => {
    const submitButtonCurrent = submitButton.current;
    submitButtonCurrent.classList.remove("is-active");
    submitButtonCurrent.disabled = true;
  }

  const firstStart = (): void => {
    startCamera();
    toggleStartCameraBtn();
    toggleCaptureCameraBtn();
  }

  const startCamera = (): void => {
    const video: HTMLVideoElement = videoContainer.current;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
          video.srcObject = stream;
          video.play();
        })
        .catch(function (error) {
          console.log("Something went wrong!");
        });
    }
  }

  const stopCamera = (): void => {
    const video = videoContainer.current;
    video.srcObject.getVideoTracks().forEach((track) => track.stop());
  }

  const saveAvatarLink = (link: string): void => {
    dispatch(addUserInfoToStateAction("userAvatarLink", link));
  }

  const capturePhoto = (): void => {
    const video: HTMLVideoElement = videoContainer.current;
    const canvas = photoContainer.current;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    stopCamera();
    togglePhotoAndVideoContainers();
    uploadPhoto();
  }

  const deletePhoto = (): void => {
    disableSubmitButton();
    const canvas = photoContainer.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    togglePhotoAndVideoContainers();
    saveAvatarLink("");
    startCamera();
  }

  const uploadPhoto = () => {
    setLoadingStatus(true);
    const fileName = `${userID}_avatar.jpeg`;
    const canvas = photoContainer.current;

    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append('file', blob, fileName);
      $api.post<IUserAvatarInfo>("/files/upload-avatar", formData, axiosConfig)
        .then((res) => {
          toggleErrorBar(false, 1);
          setPhotoError(false);
          saveAvatarLink(res.data.userAvatarLink);
          enableSubmitButton();
        })
        .catch((error) => {
          setLoadingStatus(false);
          toggleErrorBar(true, 1);
          setPhotoError(true);
        })
        .finally(() => {
          setLoadingStatus(false);
        })
    }, "image/jpeg", 1)
  }

  const stopUpload = () => {
    controller.abort()
  }

  useEffect(() => {
    disableSubmitButton()
  }, []);

  const togglePhotoAndVideoContainers = (): void => {
    const photoWrapper: HTMLDivElement = cameraPhoto.current;
    const videoWrapper: HTMLDivElement = cameraVideo.current;

    videoWrapper.classList.toggle("active");
    photoWrapper.classList.toggle("active");
  }

  const toggleStartCameraBtn = (): void => {
    const startBtn: HTMLButtonElement = document.querySelector(".btn_start");
    startBtn.classList.toggle("active");
  }

  const toggleCaptureCameraBtn = () => {
    const captureBtn: HTMLButtonElement = document.querySelector(".btn_capture");
    captureBtn.classList.toggle("active");
  }

  return (
    <div className='step'>
      <h1 className='step__title step__title_various'></h1>
      <p className='step__description'>Смотрите прямо в камеру, без солнцезащитных очков и головных уборов.</p>
      <div className='camera__wrapper'>
        <div ref={cameraVideo} className='camera__video active'>
          <video ref={videoContainer} autoPlay={false} id="video-container" />
          <button onClick={firstStart} className="btn btn_start active"><i className="icon-camera"></i></button>
          <button onClick={capturePhoto} className="btn btn_capture"><i className="icon-camera white"></i></button>
        </div>
        <div ref={cameraPhoto} className='camera__photo'>
          <canvas ref={photoContainer} id="photo-container" className={isPhotoError ? "photo-container_error" : ""} width={canvasWidth} height={canvasHeight} />
          <CircleProgressBar
            percent={percent}
            stop={stopUpload}
            reload={uploadPhoto}
            remove={deletePhoto}
            isLoading={isLoading}
            isError={isPhotoError} />
        </div>
      </div>
      <div className="step__footer">
        <button className="step__submit" ref={submitButton} onClick={() => changeRegStep(+1)}>Продолжить</button>
      </div>
    </div>
  )
}
