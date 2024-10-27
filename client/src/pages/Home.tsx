import { Link } from "react-router-dom";
import FormCard from "../components/FormCard";

export default function HomePage() {
    return (
        <div className='px-6 py-4'>
            <FormCard title='Home'>
                <p className='italic'>Welcome to our platform!</p>
                <div className='flex flex-col gap-2 py-4'>
                    <p>Are you feeling unwell?</p>
                    <Link
                        to='/request-referral'
                        className='text-emerald-400 hover:underline hover:text-emerald-500'
                    >
                        Request a medical referral
                    </Link>
                </div>
                <div className='flex flex-col gap-2 py-4'>
                    <p>Need some info about your previous medical data?</p>
                    <Link
                        to='/documents'
                        className='text-emerald-400 hover:underline hover:text-emerald-500'
                    >
                        Request a medical referral
                    </Link>
                </div>
            </FormCard>
        </div>
    );
}
