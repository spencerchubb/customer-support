"use client";
import { useState } from 'react';

export default function CompanyPage({ documents }: { documents: any[] }) {
    const [text, setText] = useState('');
    const [docs, setDocs] = useState([...documents] ?? []);

    function onSubmit() {
        fetch('/api/insertDocument', {
            method: 'POST',
            body: JSON.stringify({ text }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.doc) {
                    setDocs(oldDocs => [...oldDocs, data.doc]);
                    setText('');
                } else {
                    alert('Failed to save document');
                }
            });
    }

    function onDelete(doc: any) {
        fetch('/api/deleteDocument', {
            method: 'POST',
            body: JSON.stringify({ id: doc.id }),
        })
            .then(res => res.json())
            .then(data => {
    
                if (data.success) setDocs(oldDocs => oldDocs.filter(doc => doc.id !== data.id));
                else alert('Failed to delete document');
            });
    }

    return <div className="w-full flex flex-col items-center px-4">
        <h1>Company POV</h1>
        <div className="w-full flex flex-col items-center">
            <textarea
                className="mt-4 w-96 h-48 border border-gray-400 rounded focus:shadow-lg p-2"
                placeholder="Document content"
                value={text}
                onChange={(e) => setText(e.target.value)}
            ></textarea>
            <button className="button mt-2" onClick={onSubmit}>Save Document</button>
        </div>
        <p className="mt-4 font-bold">{docs.length} documents</p>
        {docs?.map((document: any, i: number) => (
            <div key={i} className="w-full mt-4 p-4 border border-gray-300 rounded flex">
                <p className="w-full whitespace-pre-wrap">{document.text}</p>
                <button className="button" style={{ height: "fit-content" }} onClick={() => onDelete(document)}>✖</button>
            </div>
        ))}
        <div className="mt-32"></div>
    </div>
}