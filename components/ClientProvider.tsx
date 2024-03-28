"use client";
import {Toaster} from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";


export default function ClientProvider() {
  return (
    <>
        <Toaster position = "top-right"/>
    </>
  )
}