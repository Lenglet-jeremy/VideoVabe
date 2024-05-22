import React, { useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signin } from "../../apis/users";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import AuthContext from "../../context/AuthContext";

export default function Login() {
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const schema = yup.object({
    email: yup.string().required("Le champ est obligatoire"),
    password: yup.string().required("Le mot de passe est obligatoire"),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  async function submit(values) {
    handleResetFeedback();
    try {
      const response = await signin(values);
      login(response.token);
      setStatus(response.status);
      if (response.status === 200 || !response.message) {
        setFeedback(`Bienvenue ${response.user.username}`);
        reset(defaultValues);
        setShowModal(true);
      } else {
        setFeedback(response.message);
        setShowModal(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleResetFeedback() {
    setFeedback(null);
  }

  function handleCloseModal() {
    setShowModal(false);
    if (status === 200) {
      navigate("/");
    }
  }

  return (
    <div className="vw100">
      <div className="f-center h100Percent DarkBg">
        <form onSubmit={handleSubmit(submit)}>
          <div className="d-flex flex-column mb-10">
            <label htmlFor="email" className="mb-10">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className="mb-10"
            />
            {errors.email && <p className="text-error">{errors.email.message}</p>}
          </div>

          <div className="d-flex flex-column mb-10">
            <label htmlFor="password" className="mb-10">
              Mot de passe
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="mb-10"
            />
            {errors.password && (
              <p className="text-error">{errors.password.message}</p>
            )}
          </div>

          <button className="btn btn-primary">Submit</button>
        </form>
        {showModal && (
          <Modal onClose={handleCloseModal} feedback={feedback}>
            <button
              className="btn btn-reverse-primary"
              onClick={handleCloseModal}
            >
              Fermer
            </button>
          </Modal>
        )}
      </div>
    </div>
  );
}
