// import { useContext } from "react";
// import UserContext from "../store/UserContext.tsx";

import { useContext } from "react";
import UserContext from "../store/UserContext";

export const BACKEND_URL =
    "https://hacktech-backend-296479925771.europe-west4.run.app";

const useAPI = () => {
    // const { axiosAPI } = useContext(UserContext);

    // const postQuestions1 = async (symptoms: string) => {
    //     try {
    //         const response = await axiosAPI.post(
    //             `${BACKEND_URL}/api/prompting/questions`,
    //             {
    //                 symptoms: symptoms,
    //             },
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error fetching health status:", error);
    //         throw error;
    //     }
    // };

    const { token } = useContext(UserContext);

    const postQuestions = async (symptoms: string) => {
        const response = await fetch(`${BACKEND_URL}/api/prompting/questions`, {
            method: "POST",
            body: JSON.stringify({ symptoms: symptoms }),
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log(data);
        return data;
    };

    const uploadPatientData = async (prompt: string) => {
        const response = await fetch(`${BACKEND_URL}/api/finalprompting/`, {
            method: "POST",
            body: JSON.stringify({ answers: prompt }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        console.log(data);
        return data;
    };

    return {
        postQuestions,
        uploadPatientData,
    };
};

export default useAPI;
