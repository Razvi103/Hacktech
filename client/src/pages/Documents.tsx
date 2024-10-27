import { useEffect, useState } from "react";
import useAPI from "../api/FilesAPI";
import FormCard from "../components/FormCard";
import { Link } from "react-router-dom";
import pngFileIcon from "../assets/icons/png.png";
import jpgFileIcon from "../assets/icons/jpg.png";
import pdfFileIcon from "../assets/icons/pdf.png";
import jpegFileIcon from "../assets/icons/jpeg.png";
import svgFileIcon from "../assets/icons/svg.png";
import txtFileIcon from "../assets/icons/txt.png";

type File = {
    name: string;
    path: string;
    type: string;
    date: string;
};

const mockFiles: File[] = [
    {
        name: "file1.png",
        path: "/path/to/file1",
        type: "Medical letter",
        date: "2022-01-01",
    },
    {
        name: "file2.pdf",
        path: "/path/to/file2",
        type: "MRI scan",
        date: "2022-01-02",
    },
    {
        name: "file3.pdf",
        path: "/path/to/file3",
        type: "CT scan",
        date: "2022-01-03",
    },
    {
        name: "file4.jpg",
        path: "/path/to/file4",
        type: "X-ray",
        date: "2022-01-04",
    },
    {
        name: "file5.txt",
        path: "/path/to/file5",
        type: "Receipt",
        date: "2022-01-05",
    },
    {
        name: "file6.svg",
        path: "/path/to/file6",
        type: "Lab report",
        date: "2022-01-06",
    },
    {
        name: "file7.jpeg",
        path: "/path/to/file7",
        type: "Prescription",
        date: "2022-01-07",
    },
    {
        name: "file8.png",
        path: "/path/to/file8",
        type: "Medical letter",
        date: "2022-01-08",
    },
    {
        name: "file9.pdf",
        path: "/path/to/file9",
        type: "MRI scan",
        date: "2022-01-09",
    },
    {
        name: "file10.jpg",
        path: "/path/to/file1",
        type: "X-ray",
        date: "2022-01-10",
    },
    {
        name: "file11.txt",
        path: "/path/to/file1",
        type: "Receipt",
        date: "2022-01-11",
    },
    {
        name: "file12.svg",
        path: "/path/to/file1",
        type: "Lab report",
        date: "2022-01-12",
    },
    {
        name: "file13.jpeg",
        path: "/path/to/file1",
        type: "Prescription",
        date: "2022-01-13",
    },
    {
        name: "file14.png",
        path: "/path/to/file1",
        type: "Medical letter",
        date: "2022-01-14",
    },
    {
        name: "file15.pdf",
        path: "/path/to/file1",
        type: "MRI scan",
        date: "2022-01-15",
    },
];

function FileLine({ file, index }: { file: File; index: number }) {
    return (
        <div className='flex items-center justify-between py-2 border-b border-stone-200'>
            <div className='flex items-center space-x-4 px-6'>
                <p className='text-zinc-600 w-4'>{index}</p>
                <img
                    src={
                        file.name.endsWith(".pdf")
                            ? pdfFileIcon
                            : file.name.endsWith(".png")
                            ? pngFileIcon
                            : file.name.endsWith(".jpg")
                            ? jpgFileIcon
                            : file.name.endsWith(".jpeg")
                            ? jpegFileIcon
                            : file.name.endsWith(".svg")
                            ? svgFileIcon
                            : file.name.endsWith(".txt")
                            ? txtFileIcon
                            : txtFileIcon
                    }
                    className='h-12'
                    alt='file icon'
                />
                <div>
                    <p className='text-sm font-semibold text-stone-700'>
                        {file.name}{" "}
                        <span className='text-stone-400'>- {file.path}</span>
                    </p>
                    <p className='text-xs text-stone-400'>{file.date}</p>
                </div>
            </div>
            <p className='text-sm font-semibold text-stone-700'>{file.type}</p>
            <Link
                to={file.path + "/" + file.name}
                target='_blank'
                rel='noreferrer'
                className='text-sm font-semibold text-blue-500'
            >
                View
            </Link>
        </div>
    );
}

export default function DocumentsPage() {
    const [files, setFiles] = useState<File[]>([]);
    const { getAllFiles } = useAPI();

    useEffect(() => {
        async function fetchFiles() {
            const files = await getAllFiles();
            console.log(files);
            // setFiles(files);
        }

        fetchFiles();
        setFiles(mockFiles);
        console.log(files);
    }, [files, getAllFiles]);

    return (
        <div className='px-6 py-4'>
            <FormCard title='Medical files'>
                <p className='text-sm font-semibold text-stone-400'>
                    It the following section you can find all the files that you
                    uploaded over the years, and they represent your digital
                    medical folder.
                </p>
                {files.map((file, index) => (
                    <FileLine key={index} file={file} index={index} />
                ))}
            </FormCard>
        </div>
    );
}
