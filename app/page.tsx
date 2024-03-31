"use client";
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    return (
        <div className="w-full flex flex-col items-center">
            <h1>Customer Support</h1>
            <button className="button mt-4 w-48" onClick={() => router.push("/customer")}>Customer POV</button>
            <button className="button mt-4 w-48" onClick={() => router.push("company")}>Company POV</button>
            <div style={{ width: "400px", maxWidth: "90%" }}>
                <p className="mt-8">
                    This is Spencer Chubb&apos;s Customer Support project.
                    There is a Customer Point of View for chatting with the AI, and a Company Point of View for uploading the knowledge base.
                    The purpose is to try out LLMs, not to make a production-ready system.
                </p>
                <p className="mt-4">Tech stack:</p>
                <ul className="list-disc list-inside">
                    <li>Next.js / Vercel</li>
                    <li>Typescript</li>
                    <li>Tailwind CSS</li>
                    <li>OpenAI API</li>
                    <li>Supabase</li>
                </ul>
            </div>
            <a className="mt-4 text-lg" href="https://github.com/spencerchubb/customer-support">Github Repository</a>
        </div>
    );
}
