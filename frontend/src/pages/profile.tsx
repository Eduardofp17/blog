import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import React, { useEffect, useState } from 'react';
import { ChevronLeft, X, Trash } from 'lucide-react';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/Modal/modal';
import { ButtonColor, ModalViewProps } from '@/components/ui/Modal/types';
import { Link } from 'react-router-dom';
import { Methods, useApiRequest } from '@/hooks/use-api-request';
import { SuccessCode } from '@/response-codes';

type FormData = {
  username: string;
  email: string;
  name: string;
  lastname: string;
};

export const Profile: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token, logout } = useAuthContext();
  const { loading, setLoading, handleGetUser, user } = useGlobalContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ModalProps, setModalProps] = useState<ModalViewProps>({
    ModalTitle: '',
    ModalDescription: '',
    isModalOpen: isModalOpen,
    buttonColor: 'red',
    confirmButtonTitle: '',
    handleAction: () => {},
    btnCancelText: 'cancel',
    setIsModalOpen: () => {},
  });
  const { request } = useApiRequest();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

      if (!allowedTypes.includes(file.type)) {
        alert('Only PNG, JPG, and JPEG files are allowed.');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0];
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];

      if (!allowedTypes.includes(file.type)) {
        alert('Only PNG, JPG, and JPEG files are allowed.');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleCancelEditing = () => {
    setEditing(false);
    handleResetForm(user);
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  const handleResetForm = (data: User) => {
    setValue('email', data.email);
    setValue('name', data.name);
    setValue('username', data.username);
    setValue('lastname', data.lastname);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };
  const handleUpdateUser = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await request(
        `/users/me`,
        Methods.PATCH,
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data,
        SuccessCode.PROFILE_SUCCESSFULLY_EDITED
      );

      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response2 = await request(
          `/users/me/profile-pic`,
          Methods.PATCH,
          {
            Authorization: `Bearer ${token}`,
          },
          formData
        );

        if (!response2.success) return;
      }

      if (!response.success) return;

      setLoading(true);
      handleGetUser();
      setEditing(false);
      setSelectedFile(null);
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  const handleOpenModal = (
    ModalTitle: string,
    ModalDescription: string,
    confirmButtonTitle: string,
    btnCancelText: string,
    buttonColor: ButtonColor,
    handleAction: () => void
  ) => {
    setIsModalOpen(true);
    setModalProps({
      ModalTitle,
      ModalDescription,
      confirmButtonTitle,
      buttonColor,
      handleAction,
      isModalOpen: isModalOpen,
      btnCancelText: btnCancelText,
      setIsModalOpen,
    });
  };

  const handleDeleteProfilePicture = async () => {
    try {
      const response = await request(`/users/me/profile-pic`, Methods.DELETE, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
      if (!response.success) return;

      if (selectedFile) setSelectedFile(null);

      setLoading(true);
      setIsModalOpen(false);
      setEditing(false);
      handleGetUser();
    } catch (err) {}
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await request(`/users/me`, Methods.DELETE, {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      if (!response.success) return;

      logout();
      window.location.reload();
    } catch (err) {
      throw new Error('Internal Server Error');
    }
  };

  useEffect(() => {
    if (selectedFile) setEditing(true);
  }, [selectedFile]);

  useEffect(() => {
    handleResetForm(user);
  }, [user]);

  useEffect(() => {
    if (editing) {
      handleGetUser();
    }
  }, [editing]);

  return loading ? (
    children
  ) : (
    <>
      <Modal
        isModalOpen={isModalOpen}
        ModalTitle={ModalProps.ModalTitle}
        ModalDescription={ModalProps.ModalDescription}
        setIsModalOpen={setIsModalOpen}
        btnCancelText={ModalProps.btnCancelText}
        buttonColor={ModalProps.buttonColor}
        confirmButtonTitle={ModalProps.confirmButtonTitle}
        handleAction={ModalProps.handleAction}
      />
      <section className="pt-24 sm:pt-28 md:pt-36 px-6 sm:px-8 max-w-screen-md mx-auto animate-scroll flex flex-col gap-2 pb-4">
        <span className="text-sm sm:text-md flex flex-row items-center gap-2 pb-2">
          <ChevronLeft />
          <button
            onClick={handleGoBack}
            className="underline text-blue-500 hover:text-blue-700"
          >
            {t('back to the previous page')}
          </button>
        </span>
        <Card className="p-4 mx-auto relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl overflow-hidden">
          <CardHeader
            className={`text-center flex flex-col items-center justify-center  ${editing ? '' : 'border-b-2'}`}
          >
            <div className="">
              <p className={`${editing ? '' : 'hidden'} font-bold`}>
                {' '}
                {t('profile picture')}:{' '}
              </p>
              {user.profilePic ? (
                <div className="relative cursor-pointer">
                  <img
                    className="rounded-md w-28 h-28"
                    alt="Profile picture from the user"
                    src={user.profilePic}
                  />
                  <Trash
                    onClick={() =>
                      handleOpenModal(
                        t('delete profile picture'),
                        t('delete profile picture description'),
                        'delete',
                        t('cancel'),
                        'red',
                        handleDeleteProfilePicture
                      )
                    }
                    className={`absolute top-1 right-1 bg-red-500 rounded-full p-1 hover:bg-red-600 ${editing ? '' : 'hidden'}`}
                  />
                </div>
              ) : selectedFile ? (
                <div className="text-gray-600 text-center w-28 h-28 relative mb-2">
                  <X
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer"
                    onClick={() => setSelectedFile(null)}
                  />
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt=""
                    className="rounded-md"
                  />
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    'border-2 border-dashed rounded-md p-4 flex items-center justify-center text-center cursor-pointer w-36',
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  )}
                >
                  <input
                    id="file-input"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                    className="hidden w-28 h-28"
                    onChange={handleFileChange}
                  />

                  <label
                    htmlFor="file-input"
                    className="w-full h-full cursor-pointer"
                  >
                    <p className="text-gray-500">
                      {t('drag and drop')} {''}
                      <span className="text-blue-500 underline">
                        {t('browse')}
                      </span>{' '}
                      {''}
                      {t('files of type')} PNG, JPG, {t('or')} JPEG
                    </p>
                  </label>
                </div>
              )}
            </div>

            <div className="">
              <CardTitle className={`text-left ${editing ? 'hidden' : ''}`}>
                {user.name} {user.lastname}
              </CardTitle>
              <span
                className={`ext-xs text-gray-500 ${editing ? 'hidden' : ''}`}
              >
                @{user.username}
              </span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col mt-4 text-left px-2 break-words">
            <div className="flex flex-col gap-2">
              <div
                className={`flex flex-row gap-2 items-center ${editing ? 'hidden' : ''}`}
              >
                <p className="font-bold">Email:</p>
                <p>{user.email}</p>
              </div>
              <div
                className={`flex flex-row gap-2 items-center ${editing ? 'hidden' : ''}`}
              >
                <p className="font-bold">{t('password')}:</p>
                <Link to="/forgot-password" className="underline">
                  {t('redefine your password here')}
                </Link>
              </div>
            </div>
            <form action="" className={`${editing ? '' : 'hidden'} `}>
              <div>
                <Label htmlFor="username" className="text-left">
                  {t('username')}:
                </Label>
                <Input
                  id="username"
                  type="text"
                  className="text-left"
                  placeholder="Eduardofp17"
                  {...register('username', {
                    required: t('username-required'),
                    minLength: {
                      value: 3,
                      message: t('username-length'),
                    },
                    maxLength: {
                      value: 20,
                      message: t('username-length'),
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9]+$/,
                      message: t('username-invalid'),
                    },
                  })}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="name" className="text-left">
                  {t('name')}:
                </Label>
                <Input
                  id="name"
                  type="text"
                  className="text-left"
                  {...register('name', {
                    required: t('name-required'),
                    minLength: {
                      value: 2,
                      message: t('name-length'),
                    },
                    maxLength: {
                      value: 50,
                      message: t('name-length'),
                    },
                  })}
                />

                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastname" className="text-left">
                  {t('lastname')}:{' '}
                </Label>
                <Input
                  id="lastname"
                  type="lastname"
                  className="text-left"
                  {...register('lastname', {
                    required: t('lastname-required'),
                    minLength: {
                      value: 2,
                      message: t('name-length'),
                    },
                    maxLength: {
                      value: 50,
                      message: t('name-length'),
                    },
                  })}
                />
                {errors.lastname && (
                  <p className="text-red-500 text-sm">
                    {errors.lastname.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="email" className="text-left">
                  Email:{' '}
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="text-left"
                  {...register('email', {
                    required: t('email-required'),
                    pattern: {
                      value: /^\S+@\S+$/,
                      message: t('invalid-email'),
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="pt-5 w-full overflow-hidden flex flex-col sm:flex-row gap-4">
            <div
              id="editButtons"
              className={`flex flex-col w-full sm:flex-row justify-between gap-4 ${editing ? '' : 'hidden'}`}
            >
              <Button
                className=" w-full sm:w-1/2 text-red-500 border-red-500 hover:text-red-600"
                variant="outline"
                onClick={() =>
                  handleOpenModal(
                    t('confirm cancel editing'),
                    t('are you sure you want to cancel'),
                    t('discard changes'),
                    t('go back'),
                    'red',
                    handleCancelEditing
                  )
                }
              >
                {t('cancel')}
              </Button>
              <Button
                className=" w-full sm:w-1/2 bg-green-500 text-white hover:bg-green-600"
                onClick={handleSubmit(handleUpdateUser)}
              >
                {t('save changes')}
              </Button>
            </div>
            <div
              id="editButtons"
              className={`flex flex-col sm:flex-row  justify-between gap-4 ${editing ? 'hidden' : ''} mx-auto`}
            >
              <Button
                className="w-full sm:w-1/2 text-red-500 border-red-500 hover:text-red-600"
                variant="outline"
                onClick={() =>
                  handleOpenModal(
                    t('confirm delete account'),
                    t('are you sure you want to delete your account'),
                    t('delete'),
                    t('cancel'),
                    'red',
                    handleDeleteAccount
                  )
                }
              >
                {t('delete account')}
              </Button>
              <Button
                className="w-full sm:w-1/2 bg-yellow-500 text-white hover:bg-yellow-600"
                onClick={() => {
                  setEditing(true);
                }}
              >
                {t('edit account')}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </section>
    </>
  );
};
