import { useCallback, useContext } from "react";
import UserContext from "../store/UserContext.tsx";

import { BACKEND_URL } from "./HealthAPI";

const useAPI = () => {
    const { token } = useContext(UserContext);

    const getAllFiles = useCallback(async () => {
        const response = await fetch(
            `${BACKEND_URL}/api/create-medication/get-all-files`,
            {
                method: "POST",
                body: JSON.stringify({ token: token }),
                headers: { "Content-Type": "application/json" },
            }
        );
        const data = await response.json();
        console.log(data);
        return data;
    }, [token]);

    return {
        getAllFiles,
    };
};

export default useAPI;
