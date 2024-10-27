import { useEffect, useState } from "react";
import useAPI from "../api/FilesAPI";

type File = {
    name: string;
    path: string;
};

export default function DocumentsPage() {
    const [files, setFiles] = useState<File[]>([]);
    const { getAllFiles } = useAPI();

    useEffect(() => {
        async function fetchFiles() {
            const files = await getAllFiles();
            setFiles(files);
        }

        fetchFiles();
        console.log(files);
    }, [files, getAllFiles]);

    return <div>Documents</div>;
}
