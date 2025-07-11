"use client"; 
import React, { useState} from "react";

import { useRouter } from "next/navigation";
import Image from 'next/image'



import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {   faPen } from "@fortawesome/free-solid-svg-icons";

interface UserData {
  firstName: string;
  lastName: string;
  bio: string;
  address: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
}

interface FormField {
  label: string;
  key: keyof UserData;
  type: string;
}

export default function SettingsPage() {
  const router = useRouter();
 
 

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    bio: "",
    address: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
  });



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const formFields: FormField[] = [
    { label: "First Name", key: "firstName", type: "text" },
    { label: "Last Name", key: "lastName", type: "text" },
    { label: "Bio", key: "bio", type: "text" },
    { label: "Address", key: "address", type: "text" },
    { label: "Email", key: "email", type: "email" },
    { label: "Phone Number", key: "phoneNumber", type: "text" },
    { label: "Date of Birth", key: "dateOfBirth", type: "date" },
  ];

  return (
    <div className="flex flex-col justify-center p-5 gap-6 dark:text-white items-center dark:bg-black">
      <h1 className="font-bold text-5xl">Settings</h1>
     

      <div className="w-full flex justify-center mb-6 mt-4 gap-10">
        <div className="relative">
          <Image
            src=""
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <input
          title="g"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="profileImageUpload"
          />
          <label
            htmlFor="profileImageUpload"
            className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow hover:bg-gray-100 dark:text-gray-800 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPen} />
          </label>
        </div>
        {selectedFile && (
          <div className="w-[20%] mt-14">
            <button
              type="button"
              className="mt-2 bg-green-500 text-white px-2 text-xs rounded"
            >
              Save Image
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-50 w-full rounded-lg shadow max-w-4xl p-6 dark:bg-gray-800">
        <form  className="flex flex-col space-y-4 w-full">
          {formFields.map((field, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row md:items-center gap-2"
            >
              <label className="md:w-[40%] w-full">{field.label}</label>
              <input
              title="d"
                type={field.type}
                value={userData[field.key]}
                onChange={(e) =>
                  setUserData({ ...userData, [field.key]: e.target.value })
                }
                className="border rounded-md p-2 md:w-[60%] w-full dark:text-black"
              />
            </div>
          ))}

          <div className="flex justify-end mt-4 items-center">
            <button
              type="submit"
              className="bg-green-500 text-white rounded-lg px-4 py-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <div className="flex md:flex-row gap-12 w-full mt-8 justify-center items-center">
        <label className="w-[70%] sm:text-2xl text-lg font-semibold">
          Update Password
        </label>
        <button
          type="button"
        onClick={()=>{ router.push('/admin/');}}
          className="bg-[#FFB640] text-white rounded-lg px-2 py-2 w-[20%]"
        >
          Edit
        </button>
      </div>

   
    </div>
  );
}