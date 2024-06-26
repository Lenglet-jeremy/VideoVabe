import React, { useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signup } from "../../apis/users";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import AuthContext from "../../context/AuthContext";

export default function Register() {
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const schema = yup.object({
    username: yup.string().required("Le champ est obligatoire"),
    email: yup
      .string()
      .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Email non valide")
      .required("Le champ est obligatoire"),
    password: yup
      .string()
      .required("Le mot de passe est obligatoire")
      .min(5, "trop court"),
    confirmPassword: yup
      .string()
      .required("Vous devez confirmer votre mot de passe")
      .oneOf([yup.ref("password"), ""], "Les mots de passe ne correspondent pas"),
    rgpd: yup
      .boolean()
      .oneOf([true], "Vous devez accepter les termes et les conditions"),
  });

  const defaultValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    rgpd: false,
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
    setFeedback(null);
    handleResetFeedback();
    console.log(values);
    try {
      const response = await signup(values);
      login(response.token);
      console.log(response);
      setFeedback(response.message);
      setStatus(response.status);
      setShowModal(true);
    } catch (error) {
      console.error("Error during registration:", error);
      setFeedback("Erreur lors de l'enregistrement. Veuillez réessayer.");
      setShowModal(true);
    }
  }

  function handleResetFeedback() {
    setFeedback(null);
  }

  function handleCloseModal() {
    setShowModal(false);
    if (status === 200) {
      navigate("/login");
      reset(defaultValues);
    }
  }

  return (
    <div className="f-center w100Percent DarkBg">
      <form onSubmit={handleSubmit(submit)}>

        <div className="d-flex flex-column mb-10">
          <label htmlFor="username" className="mb-10">
            Pseudo
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            className="mb-10"
          />
          {errors.username && (
            <p className="text-error">{errors.username.message}</p>
          )}
        </div>

        <div className="d-flex flex-column mb-10">
          <label htmlFor="email" className="mb-10">
            Email
          </label>
          <input
            {...register("email")}
            type="text"
            id="email"
            className="mb-10"
          />
          {errors.email && (
            <p className="text-error">{errors.email.message}</p>
          )}
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
        <div className="d-flex flex-column mb-10">
          <label htmlFor="confirmPassword" className="mb-10">
            Confirmation de mot de passe
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            className="mb-10"
          />
          {errors.confirmPassword && (
            <p className="text-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="d-flex flex-column">
          <div className="mb-10">
            <label htmlFor="option1">Femme</label>
            <input type="radio" id="option1" name="choix" value="1" />
          </div>
          <div className="mb-10">
            <label htmlFor="option2">Homme</label>
            <input type="radio" id="option2" name="choix" value="2" />
          </div>
        </div>

        <div className="d-flex flex-column mb-10">
          <label htmlFor="rgpd" className="mb-10">
            <input
              {...register("rgpd")}
              type="checkbox"
              className="mr-15"
              id="rgpd"
            />
            En soumettant ce formulaire j'accepte ...
          </label>
          {errors.rgpd && <p className="text-error">{errors.rgpd.message}</p>}
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
  );
}
